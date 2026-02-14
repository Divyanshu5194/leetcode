import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"

export default function Signup(){
    const signupSchema=z.object({
        username:z.string().min(3,"Username Should be atleast 3 characters long").max(80,"username should not be greater than 80 characters"),
        email:z.string().min(7,"Email should be greater than 7 charcters").max(256,"Email cant be greater than 256 charcters").email("please enter a valid email"),
        Password:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters")
    })


    const {register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(signupSchema)});
    const [invalid,setInvalid]=useState(false)

    

    return (
        <div className='min-h-screen grid place-items-center bg-base-200'>
            <div className="card w-96 bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 justify-center">
                <h2 className='text-2xl font-bold text-center mb-8' >Sign Up for Leetcode</h2>
                <form onSubmit={handleSubmit((data)=>{
                    if(data.Password!=data.ConfirmPassword){
                        setInvalid(true)
                        return
                    }
                    setInvalid(false)
                    console.log(data)
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
                        <input className='input input-bordered w-full' placeholder='Enter Password' type='password' {...register('Password',{required:true})} />
                        {errors.Password && <p className='text-red-700' >{errors.Password.message}</p>}
                    </div>

                    <div className='mb-8'>
                        <label>Confirm Password</label>
                        <input className='input input-bordered w-full' placeholder='Confirm Password' type='password' {...register('ConfirmPassword',{required:true})} />
                        {errors.ConfirmPassword && <p className='text-red-700' >Confirm password shoulnt be empty</p>}
                    </div>

                    {(invalid)?<p className='text-red-700 mb-4' >Entered Passwords Do Not Match</p>:<p className='text-red-700 mb-4' ></p>}

                    <input className='btn btn-active bg-blue-400 text-white w-full' type="submit" />
                </form>
            </div>
        </div>
    );
}