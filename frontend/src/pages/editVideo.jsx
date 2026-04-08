import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import Popup from "../components/Popup";
import { axiosClient } from "../utils/axiosClient";

export default function EditVideo(){
  const {slug} =useParams()

  const [doesVideoExists,setDoesVideoExists]=useState(false)
  const [deleteVideoMsg,setDeleteVideoMsg]=useState()
  const [deleteVideoError,setDeleteVideoError]=useState()
  const [problem,setProblem]=useState(null)
  const [loading,setLoading]=useState(null)
  const [error,setError]=useState(null)

  useEffect(()=>{
            (async ()=>{
            try{
                const response=await axiosClient.get(`/Problems/${slug}`)
                setProblem(response.data.data)
            }
            catch(error){
                setError(error)
            }
            finally{
              setLoading(false)
              
            }
        })();
        
  },[slug])

  useEffect(()=>{
            (async () => {
          await checkExistingVideo()
        })();
  },[problem,deleteVideoError,deleteVideoMsg])

  

  async function checkExistingVideo(){
    //checkVideoExistannce/:problemId
    if(problem)
    {        try{
      console.log("checking video existance")
                const response=await axiosClient.get(`video/checkVideoExistannce/${problem?._id}`)
                setDoesVideoExists(true)
                console.log({VIDEO_EXISTING_RES:response})
            }
            catch(error){
                console.log(error)
            }}
        
  }
 
  async function deleteVideo(){
          if(window.confirm("Are you sure you want to delete this problem solution video?")){try{
              const {data:response}=await axiosClient.delete(`video/deletevideo/${problem?._id}`)
              setDeleteVideoMsg(response.msg)
          }
          catch(error){
              setDeleteVideoError(error.response.data.error || "an error occured")
          }}
  }
  
  return (
      <>
        {doesVideoExists && <> 

          <video className="h-auto w-auto"></video>
          <button onClick={()=>{deleteVideo(slug)}} className="btn btn-active">Delete Video</button>
        </>}
        {!doesVideoExists && <>
          <p>No Video Found For this problem</p>
          <NavLink to={`/uploadvideo/${problem?._id}`} className="btn btn-accent"> Upload Video</NavLink>
        </>}
        {deleteVideoError && <Popup message={deleteVideoError} mode={"error"}></Popup>}
      </>
  );
};



// problem.secureUrl=secureUrl
//         problem.thumbnailUrl=thumbnailUrl
//         problem.durationInMilliseconds