import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export default function Login(){
    const dispatch=useDispatch()
    const {isAuthenticated,error}=useSelector((state)=>state.auth)
    const navigate=useNavigate()
    console.log({isAuthenticated})

    const [showPassword,setShowPassword]=useState(false)

    useEffect(()=>{
        if(isAuthenticated){
            navigate("/")
        }
    },[isAuthenticated])

    const loginSchema=z.object({
        login:z.union([z.string().min(3,"Username Should be atleast 3 charcters long").max(30,"username cant be greater than 30 characters").refine((value)=>!value.includes("@"),"Invalid Email"),z.string().email("Enter a valid email")]),
        password:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters")
    })

    const {register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(loginSchema)})

    return (
        <div className='min-h-screen grid place-items-center bg-base-200'>
            <div className="card w-96 bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 justify-center">
                <h2 className='text-2xl font-bold text-center mb-8' >Login Into Your Leetcode Account</h2>
                <form onSubmit={handleSubmit((data)=>{
                    console.log({data})
                    dispatch(login(data))
                    })}>
                    <div className='mb-4'>
                        <label >Username or Email</label>
                        <input className='input input-bordered w-full' placeholder='Enter Username or Email' {...register('login',{required:true})} />
                        {errors.login && <p className='text-red-700'>{errors.login.message}</p>}
                    </div>

                    <div className='mb-8'>
                        <label>Password</label>
                        <input className='input input-bordered w-full' placeholder='Enter Password' type={showPassword ? "text" : "password"} {...register('password',{required:true})} />
                        <button className='' onClick={()=>{setShowPassword(!showPassword)}}>{showPassword ? "Hide" : "show"}</button>
                        {errors.password && <p className='text-red-700' >{errors.password.message}</p>}
                    </div>

                    <div className='w-full flex justify-between mb-4'>
                        <p >Don't Have a account? <a className='link text-blue-600 pl-1' onClick={()=>{
                            navigate("/signup")
                        }}>Signup</a></p>
                    </div>

                    {error && <p className='text-red-700' >{error}</p>}

                    <input className='btn btn-active bg-blue-400 text-white w-full' type="submit" />
                </form>
            </div>
        </div>
    );
}