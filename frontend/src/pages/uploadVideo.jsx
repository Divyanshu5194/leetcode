import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { axiosClient } from "../utils/axiosClient"
import { useForm } from "react-hook-form"
import axios from "axios"

export default function UploadVideo(){
    const {problemId}=useParams()

    const [uploading,setUploading]=useState(false)
    const [uploadedPercentage,setUploadedPercentage]=useState(0)
    const [uploadedVideoMetaData,setUploadedVideoMetaData]=useState({})


    console.log(problemId)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        clearErrors,
    } = useForm()

    const videoFile=watch("videoFile")?.[0]

    const onSubmit=async (data)=>{
        console.log("on submit called")
        const file=data.videoFile[0]

        setUploading(true)
        setUploadedPercentage(0)
        clearErrors()

        try{
            const singatureResponse=await axiosClient.get(`video/getDigitalSignature/${problemId}`)
            const {signature,
            timestamp,
            public_id,
            api_key,
            cloud_name,
            upload_url} = singatureResponse.data.data

            console.log({SINGATUE_REsPONSE_DATA:singatureResponse.data})

            const formData=new FormData()

            formData.append("file",file)
            formData.append("signature",signature)
            formData.append("timestamp",timestamp)
            formData.append("public_id",public_id)
            formData.append("api_key",api_key)


            const uploadResponse=await axios.post(upload_url,formData,{
                headers:{
                    "Content-Type":"multipart/form-data",
                },
                onUploadProgress:(ProgressEvent)=>{
                    const progress = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total);
                    setUploadedPercentage(progress)
                }
            })

            const cloudinaryResponse=uploadResponse.data

            const metaDataResponse=await axiosClient.post("video/saveMetaData",{
                problemId:problemId,
                cloudinaryPublicId:cloudinaryResponse.public_id,
                cloudinaryUrl:cloudinaryResponse.cloudinaryUrl,
                secureUrl:cloudinaryResponse.secure_url,
                duration:cloudinaryResponse.duration
            })

            setUploadedVideoMetaData(metaDataResponse.data.Video)
            reset()
        }
        catch(error){
            console.error("error in uploading",error)
        }
        finally{
            setUploadedPercentage(0)
            setUploading(false)
        }

    }

    return(
        <form className="space-y-6 max-w-md" onSubmit={handleSubmit(onSubmit)}>
  {/* Input Section */}
  <div className="flex flex-col space-y-2">
    <label htmlFor="videoFile" className="text-sm font-medium text-gray-700">
      Select Video
    </label>
    <input
      id="videoFile"
      type="file"
      accept="video/*"
      disabled={uploading}
      className="file-input file-input-bordered w-full"
      {...register("videoFile", {
        required: "Please select a video file",
        validate: {
          isVideo: (files) => {
            if (!files || !files.length) return "Please select a file";
            // File type returns a MIME type like "video/mp4", so we check the prefix
            if (!files[0].type.startsWith("video/")) {
              return "Please select a valid video file";
            }
            return true;
          },
        },
      })}
    />
  </div>

  {/* File Details */}
  {videoFile && (
    <div className="bg-base-200 p-4 rounded-md text-sm space-y-1">
      <p><span className="font-semibold">Name:</span> {videoFile.name}</p>
      {/* Optional: Format size to Megabytes for better UX */}
      <p><span className="font-semibold">Size:</span> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
    </div>
  )}

  {/* Upload Progress */}
  {uploading && (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>Uploading...</span>
        <span>{uploadedPercentage}%</span>
      </div>
      <progress 
        className="progress progress-accent w-full" 
        value={uploadedPercentage} 
        max="100"
      />
    </div>
  )}

  {/* Metadata */}
  {uploadedVideoMetaData && (
    <div className="bg-success/10 text-success p-4 rounded-md text-sm">
      <p><span className="font-semibold">Duration:</span> {uploadedVideoMetaData.duration}</p>
    </div>
  )}

  {/* Submit Button */}
  <button 
    type="submit" 
    className="btn btn-accent w-full" 
    disabled={uploading}
  >
    {uploading ? (
      <>
        <span className="loading loading-spinner loading-sm"></span>
        Uploading...
      </>
    ) : (
      "Upload Video"
    )}
  </button>
</form>
    )
}