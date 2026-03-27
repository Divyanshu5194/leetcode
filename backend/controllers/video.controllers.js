import {v2 as cloudinary} from "cloudinary"
import Problems from "../models/problems.models.js"
import Video from "../models/video.models.js"

cloudinary.config({
    cloud_name:process.env.COULD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const getUploadSignature=async (req,res)=>{
    try{
        const {problemId}=req.params
        const {_id:userId}=req.user

        const foundProblem=await Problems.findById(problemId)
        if(!foundProblem){
            return res.status(400).send({sucess:false,error:"problem not exists"})
        }
        const currentMilliSeconds=new Date().getTime()
        const timestamp=Math.round(currentMilliSeconds/1000)
        const publicId=`leetcode-solutions/${problemId}/${userId}_${timestamp}`

        const uploadParams={
            timestamp:timestamp,
            public_id:publicId
        }

        const signature = cloudinary.utils.api_sign_request(uploadParams,process.env.API_SECRET)

        res.status(200).send({success:true,data:{
            signature,
            timestamp,
            public_id:publicId,
            api_key:process.env.API_KEY,
            cloud_name:process.env.COULD_NAME,
            upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        }})
    }
    catch{
        console.log({ERROR_GENERATING_UPLOAD_SIGNATURE:error})
        res.status(500).send({success:false,error:error.message||"An error occured getting the upload signature"})
    }
}

const saveMetaData=async (req,res)=>{
    const {problemId,cloudinaryPublicId,cloudinaryUrl,secureUrl,duration}=req.body
    const {_id:userId}=req.user

    const cloudinaryResponse=await cloudinary.api.resource(cloudinaryPublicId,{resource_type:"video"})

    if(!cloudinaryResponse){
        return res.status(400).send({success:false,error:"Video hasn't been uploaded"})
    }

    const existingVideo=await Video.find({
        problem:problemId,
        user:userId,
        cloudinaryPublicId
    })

    if(existingVideo){
        return res.status(400).send({success:false,error:"Video already exists"})
    }

    const thumbnailUrl=cloudinary.url(cloudinaryResponse.public_id,{
        resource_type:"image",
        transformation: [
            { width: 400, height: 225, crop: 'fill' },
            { quality: 'auto' },
            { start_offset: 'auto' }
        ],
        format:"jpg"
    })

    const videoUrl=cloudinary.url(cloudinaryResponse.public_id,{
        resource_type:"video",
        transformation: [
            { width: 400, height: 225, crop: 'fill' },
            { quality: 'auto' },
            { start_offset: 'auto' }
        ],
        format:"mp4"
    })

    const videoSolution=new Video({
        problem: problemId,
        createdBy: userId,
        publicId: cloudinaryResponse.public_id,
        cloudinaryUrl: cloudinaryResponse.cloudinaryUrl,
        secureUrl: cloudinaryResponse.secureUrl,
        format: cloudinaryResponse.format,
        views:0,
        likes:0,
        durationInMilliseconds:cloudinaryResponse.duration,
        size: cloudinaryResponse.size,
        thumbnailUrl: thumbnailUrl,
        })

    Video.save()
}

const deleteVideo=async (req,res)=>{
    const {problemId}=req.params
    //deletion from database
    try{
        const solutionVideo=Video.findOneAndDelete({problem:problemId})

        if (!solutionVideo){
            return res.status(404).send({success:false,error:"Video to delete not found"})
        }
        await cloudinary.uploader.destroy(solutionVideo.cloudinaryPublicId,{resource_type:"video",invalidate:true})
        res.status(200).send({success:true,data:"Video Deletion Sucessful"})
    }
    catch(error){
        return res.status(500).send({success:false,error:"encountered a error in deleting the video"})
    }
}



export {getUploadSignature,saveMetaData,deleteVideo}