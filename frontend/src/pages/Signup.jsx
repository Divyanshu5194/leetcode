import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router';

export default function Signup(){
    const dispatch=useDispatch()
    const {isAuthenticated,error,loading}=useSelector((state)=>state.auth)
    const navigate=useNavigate()

    console.log({isAuthenticated,error})
    const [showPassword,setShowPassword]=useState(false)
    const [showConfirmPassword,setShowConfirmPassword]=useState(false)

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/")
        }
    },[isAuthenticated])


    const signupSchema=z.object({
        username:z.string().min(3,"Username Should be atleast 3 characters long").max(80,"username should not be greater than 80 characters"),
        email:z.string().min(7,"Email should be greater than 7 charcters").max(256,"Email cant be greater than 256 charcters").email("please enter a valid email"),
        password:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters"),
        ConfirmPassword:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters")
    })


    const {register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(signupSchema)});
    const [invalid,setInvalid]=useState(false)

    

    return (
        <div className='min-h-screen grid place-items-center bg-base-200'>
            <div className="card w-96 bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 justify-center">
                <h2 className='text-2xl font-bold text-center mb-8' >Sign Up for Leetcode</h2>
                <form onSubmit={handleSubmit((data)=>{
                    console.log({data,condition:data.password!=data.ConfirmPassword})
                    if(data.password!=data.ConfirmPassword){
                        setInvalid(true)
                        return
                    }
                    setInvalid(false)
                    dispatch(registerUser(data))
                })}>
                    <div className='mb-4'>
                        <label >Username</label>
                        <input className='input input-bordered w-full' placeholder='Enter Username' {...register('username',{required:true})} />
                        {errors.username && <p className='text-red-700'>{errors.username.message}</p>}
                    </div>

                    <div className='mb-4'>
                        <label>Email</label>
                        <input className='input input-bordered w-full' placeholder='Enter Email' {...register('email',{required:true})}/>
                        {errors.email && <p className='text-red-700' >{errors.email.message}</p>}
                    </div>

                    <div className='mb-8'>
                        <label>Password</label>
                        <input className='input input-bordered w-full' placeholder='Enter Password' type={showPassword ? "text" : "password"} {...register('password',{required:true})} />
                        <button className='' onClick={()=>{setShowPassword(!showPassword)}}>{showPassword ? "Hide" : "show"}</button>
                        {errors.password && <p className='text-red-700' >{errors.password.message}</p>}
                    </div>

                    <div className='mb-8'>
                        <label>Confirm Password</label>
                        <input className='input input-bordered w-full' placeholder='Confirm Password' type={showConfirmPassword ? "text" : "password"} {...register('ConfirmPassword',{required:true})}  />
                        <button className='' onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}>{showConfirmPassword ? "Hide" : "show"}</button>
                        {errors.ConfirmPassword && <p className='text-red-700' >Confirm password shoulnt be empty</p>}
                    </div>

                    {(invalid)?<p className='text-red-700 mb-4' >Entered Passwords Do Not Match</p>:<p className='text-red-700 mb-4' >{"           "}</p>}

                    <div className='w-full flex justify-between mb-4'>
                        <p>Already Have a account? <a className="link text-blue-600 pl-1" onClick={()=>{
                            navigate("/login")
                        }}>Login</a></p>
                    </div>

                    {error && <p className='text-red-700' >{error}</p>}

                    <input className='btn btn-active bg-blue-400 text-white w-full' disabled={loading} type="submit" />
                </form>
            </div>
        </div>
    );
}