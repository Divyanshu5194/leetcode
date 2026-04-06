import {v2 as cloudinary} from "cloudinary"
import Problems from "../models/problems.models.js"
import Video from "../models/video.models.js"

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SCERET
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
            public_id:publicId,
            timestamp:timestamp
        }

        const signature = cloudinary.utils.api_sign_request(uploadParams,process.env.API_SCERET)

        res.status(200).send({success:true,data:{
            signature,
            timestamp,
            public_id:publicId,
            api_key:process.env.API_KEY,
            cloud_name:process.env.COULD_NAME,
            upload_url:`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/video/upload`,
        }})
    }
    catch{
        console.log({ERROR_GENERATING_UPLOAD_SIGNATURE:error})
        res.status(500).send({success:false,error:error.message||"An error occured getting the upload signature"})
    }
}

const saveMetaData=async (req,res)=>{
    try{
    const {problemId,cloudinaryPublicId,cloudinaryUrl,secureUrl,duration}=req.body
    const {_id:userId}=req.user

    const cloudinaryResponse=await cloudinary.api.resource(cloudinaryPublicId,{resource_type:"video"})

    console.log({
        cloudinaryResponse
    })

    if(!cloudinaryResponse){
        return res.status(400).send({success:false,error:"Video hasn't been uploaded"})
    }

    const existingVideo=await Video.findOne({
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

    const videoSolution=await Video.create({
        problem: problemId,
        createdBy: userId,
        publicId: cloudinaryResponse.public_id,
        cloudinaryUrl: cloudinaryResponse.url,
        secureUrl: cloudinaryResponse.secure_url,
        format: cloudinaryResponse.format,
        views:0,
        durationInMilliseconds:duration,
        size: cloudinaryResponse.bytes,
        })
    
        console.log("video uploaded",videoSolution)

    return res.status(200).send({success:true,data:"Metadata Saved succesfully"})
    }
    catch(error){
        console.log(error)
        res.status(500).send({success:false,error:error.message || "An Error Occured"})
    }
}

const deleteVideo=async (req,res)=>{
    const {problemId}=req.params
    //deletion from database
    try{
        if(!problemId){
            return res.status(400).send({success:false,error:"problem id not present"})
        }
        const solutionVideo=await Video.findOne({problem:problemId})
        console.log({solutionVideo})

        if (!solutionVideo){
            return res.status(404).send({success:false,error:"Video to delete not found"})
        }
        await Video.deleteOne({problem:problemId})
        await cloudinary.uploader.destroy(solutionVideo.publicId,{resource_type:"video",invalidate:true})
        res.status(200).send({success:true,data:"Video Deletion Sucessful"})
    }
    catch(error){
        console.log("error in deleting video",error)
        return res.status(500).send({success:false,error:"encountered a error in deleting the video"})
    }
}

const checkExistingVideo=async (req,res)=>{
    try{
        const {problemId}=req.params
        const existingVideo=await Video.findOne({problem:problemId})

        console.log({existingVideo})

        if(existingVideo){
            return res.status(200).send({success:true,data:{secureUrl:existingVideo.secureUrl,duration:existingVideo.durationInMilliseconds}})
        }
        res.status(404).send({success:true,data:"Video Not Found"})
    }
    catch(error){
        console.log("error in checking video",error)
        res.status(500).send({success:true,error:error.message || "Error Serving Request"})
    }
}



export {getUploadSignature,saveMetaData,deleteVideo,checkExistingVideo}