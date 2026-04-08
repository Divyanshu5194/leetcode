import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, fetchLanguages } from '../features/auth/authSlice';

export default function ResetPassword(){
    const {isAuthenticated,user}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()



    const {tokenAndUserid}=useParams()

    const [showPassword,setShowPassword]=useState(false)
    const [showConfirmPassword,setShowConfirmPassword]=useState(false)

    const [loading,setLoading]=useState(false)
    const [response,setResponse]=useState(null)
    const [error,setError]=useState(null)

    async function resetPassword(data) {
        if(data.password==data.confirmPassword){
            const newPassword=data.password
            try{
                const data=await axiosClient.patch(`/resetpassword/${tokenAndUserid}`,{newPassword})
                const response=data
                console.log({response})
                if(data.error){
                    setError(response.error)
                    setResponse(null)
                }
                else{
                    setResponse(response.data.data)
                    setError(null)
                }
            }
            catch(error){
                console.log({error})
                setError(error.response?.data?.message || error.response?.data?.error)
                setResponse(null)
            }
            finally{
                setLoading(false)
            }
        }
        else{
            setError("Passwords do not match")
        }
    }

    const passwordSchema=z.object({
        password:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters"),
        confirmPassword:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters")
    })

    const {register,handleSubmit,formState: { errors }} = useForm({resolver:zodResolver(passwordSchema)})

        useEffect(()=>{
        dispatch(checkAuth());dispatch(fetchLanguages())
    },[response])

    useEffect(()=>{
            if(isAuthenticated){
                navigate("/")
            }
    },[isAuthenticated])

    return (
        <div className='min-h-screen grid place-items-center bg-base-200'>
            <div className="card w-96 bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 justify-center">
                <h2 className='text-2xl font-bold text-center mb-8' >Reset Your Password!</h2>
                <form onSubmit={handleSubmit(resetPassword)}>
                    <div className='mb-4'>
                        <label >New Password</label>
                        <input className='input input-bordered w-full' placeholder='Enter new password' type={showPassword ? "text" : "password"} {...register('password',{required:true})} />
                        <button className='' onClick={()=>{setShowPassword(!showPassword)}}>{showPassword ? "Hide" : "show"}</button>
                        {errors.password && <p className='text-red-700'>{errors.password.message}</p>}
                    </div>

                    <div className='mb-8'>
                        <label>Confirm Password</label>
                        <input className='input input-bordered w-full' placeholder='Confirm your password' type={showConfirmPassword ? "text" : "password"} {...register('confirmPassword',{required:true})} />
                        <button className='' onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}>{showConfirmPassword ? "Hide" : "show"}</button>
                        {errors.confirmPassword && <p className='text-red-700' >{errors.confirmPassword.message}</p>}
                    </div>

                    {error && <p className='text-red-700' >{error}</p>}
                    {response && <p className='text-green-700' >{response}</p>}

                    <button className="btn btn-active" disabled={loading} type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}