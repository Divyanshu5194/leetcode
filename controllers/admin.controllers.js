import Refreshtokens from "../models/refreshToken.model.js"
import isValidRegisteration from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/users.model.js"


const adminRegister=async (req,res)=>{
    try{
        isValidRegisteration(req,res)
        const {username,email,password}=req.body
        const hashedpassword=await bcrypt.hash(password,10)
        const existingUser=await User.findOne({
                $or:[{username},{email}]
        })
        if(existingUser){
            throw new Error("Users with the username or email already exists")
        }
        
        const newuser=await User.create({username,email,password:hashedpassword,role:"Admin"})

        const token=jwt.sign({id:newuser._id,role:newuser.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
        const refreshToken=jwt.sign({id:newuser._id,role:newuser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
        await Refreshtokens.create({user:newuser._id,refreshToken:refreshToken})

        res.cookie("acesstoken",token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:"None"})
        res.cookie("refreshToken",refreshToken,{maxAge:60*60*1000*24*30,httpOnly:true,secure:true,sameSite:"None"})
        return res.status(201).send("Admin Registeration sucessful")
    }
    catch(error){
        res.status(400).send(`Error in registration : ${error}`)
    }
}


export {adminRegister}