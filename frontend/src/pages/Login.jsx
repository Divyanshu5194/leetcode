import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"

export default function Login(){

    const loginSchema=z.object({
        login:z.union([z.string().min(3,"Username Should be atleast 3 charcters long").max(30,"username cant be greater than 30 characters").refine((value)=>!value.includes("@"),"Invalid Email"),z.string().email("Enter a valid email")]),
        Password:z.string().min(8,"password should atleast be 8 chacters long").max(20,"Password should not be greater than 30 characters")
    })

    const {register,handleSubmit,formState: { errors },} = useForm({resolver:zodResolver(loginSchema)})

    return (
        <div className='min-h-screen grid place-items-center bg-base-200'>
            <div className="card w-96 bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 justify-center">
                <h2 className='text-2xl font-bold text-center mb-8' >Login Into Your Leetcode Account</h2>
                <form onSubmit={handleSubmit((data)=>{
                    console.log(data)
                    })}>
                    <div className='mb-4'>
                        <label >Username or Email</label>
                        <input className='input input-bordered w-full' placeholder='Enter Username or Email' {...register('login',{required:true})} />
                        {errors.login && <p className='text-red-700'>{errors.login.message}</p>}
                    </div>

                    <div className='mb-8'>
                        <label>Password</label>
                        <input className='input input-bordered w-full' placeholder='Enter Password' type='password' {...register('Password',{required:true})} />
                        {errors.Password && <p className='text-red-700' >{errors.Password.message}</p>}
                    </div>

                    <input className='btn btn-active bg-blue-400 text-white w-full' type="submit" />
                </form>
            </div>
        </div>
    );
}