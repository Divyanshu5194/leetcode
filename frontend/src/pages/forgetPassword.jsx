import { useState } from "react"
import { axiosClient } from "../utils/axiosClient"

const ForgetPassword=()=>{
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    const [response,setResponse]=useState(null)
    const [email,setEmail]=useState("")

    async function forgetPassword() {
        console.log("requesting response from forger password")
        try{
            const data=await axiosClient.post("/forgetpassword",{email})
            const response=data
            console.log({response})
            if(data.error){
                setError(response.error)
            }
            else{
                setResponse(response.data.data)
            }
        }
        catch(error){
            console.log({error})
            setError(error.response?.data?.message || error.response?.data?.error)
        }
        finally{
            setLoading(false)
        }
    }

    console.log({email,response,error,loading})

    return(
        <div className='min-h-screen grid place-items-center bg-base-200'>
            <div className="card w-96 bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 justify-center">
                <h2 className='text-2xl font-bold text-center mb-8' >Reset Your Password</h2>
                <div>
                    <div className='mb-4'>
                        <label >Email?</label>
                        <input className='input input-bordered w-full' placeholder='Enter Username or Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        {error && <p className="text-red-600">{error}</p>}
                        {response && <p className="text-green-600">{response.data}</p>}
                    </div>
                    <button className="btn btn-active" disabled={loading} onClick={forgetPassword}>Search</button>
                </div>
            </div>
        </div>
    )
}


export {ForgetPassword}