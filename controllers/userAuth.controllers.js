import { User } from "../models/users.model.js"
import isValidRegisteration from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Refreshtokens from "../models/refreshToken.model.js"
import client from "../config/redisconnect.js"

const register=async (req,res)=>{
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
        
        const newuser=await User.create({username,email,password:hashedpassword,role:"User"})

        const token=jwt.sign({_id:newuser._id,role:newuser.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
        const refreshToken=jwt.sign({_id:newuser._id,role:newuser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
        await Refreshtokens.create({user:newuser._id,refreshToken:refreshToken})

        res.cookie("acesstoken",token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:"None"})
        res.cookie("refreshToken",refreshToken,{maxAge:60*60*1000*24*30,httpOnly:true,secure:true,sameSite:"None"})
        return res.status(201).send("User Registeration sucessful")
    }
    catch(error){
        res.status(400).send(`Error in registration : ${error}`)
    }
}

const login=async (req,res)=>{
    try{
        const {login,password}=req.body
        const query=login.includes("@") ? {email:login} :{username:login}

        if(!login || !password){
            throw new Error("Fill Out all the feilds") 
        }
        
        const existinguser=await User.findOne(query).select("+password")


        if(!existinguser){
            throw new Error("Invalid Credentials!")
        }

        else{
            const acess=await bcrypt.compare(password,existinguser.password)
            if(!acess){
                throw new Error("Invalid Credentials!")
            }

            const token=jwt.sign({_id:existinguser._id,role:existinguser.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
            const refreshToken=jwt.sign({_id:existinguser._id,role:existinguser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
            await Refreshtokens.create({user:existinguser._id,refreshToken:refreshToken})

            res.cookie("token",token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:"None"})
            res.cookie("refreshToken",refreshToken,{maxAge:60*60*1000*24*30,httpOnly:true,secure:true,sameSite:"None"})
            return res.status(200).send("Login Sucessful!")
        }
    }
    catch(error){
        res.status(403).send(`error in login : ${error}`)
    }
}

const logout=async (req,res)=>{
  try{
    
    const {refreshToken}=req.cookies

    if(!refreshToken){
      throw new Error("No refresh token present")
    }

    try{await Refreshtokens.findOneAndDelete({refreshToken:refreshToken})}
    catch(error){throw new Error("invalid refresh token")}


    const payload=jwt.verify(req.cookies.token,process.env.ENCRIPTION_KEY)
    const expirytime=payload.exp

    
    
    const redisClient=await client
    await redisClient.set(`token : ${req.cookies.token}`,"blocked")
    await redisClient.expireAt(`token : ${req.cookies.token}`,expirytime)

    

    res.cookie("token",null,{expires:new Date(Date.now())})
    res.cookie("refreshToken",null,{expires:new Date(Date.now())})

    res.status(200).send("Logged Out Sucessfully")
    
  }
  catch(error){
    res.status(400).send(error)
  }
}

const refresh=async (req,res)=>{
    try{
        const {refreshToken:incomingRefreshToken}=req.cookies;
        if(!incomingRefreshToken){
            return res.status(403).send("No Refresh token present")
        }

        let _id;

        try{
            const payload=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_KEY)
            _id=payload._id || payload.id
        }
        catch(error){
            return res.status(403).send("invalid user")
        }

        if(!_id){
            return res.status(403).send("invalid refresh token")
        }

        const dbtokenobj=await Refreshtokens.findOne({refreshToken:incomingRefreshToken})

        if(!dbtokenobj){
            return res.status(403).send("invalid refresh token")
        }

        if(!(dbtokenobj.refreshToken===incomingRefreshToken)){
            return res.status(403).send("invalid refresh token")
        }
        const user=await User.findOne({_id})
        

        const token=jwt.sign({_id,role:user.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
        const newrefreshToken=jwt.sign({_id,role:user.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
        await Refreshtokens.findOneAndReplace({refreshToken:incomingRefreshToken},{user:_id,refreshToken:newrefreshToken})


        res.status(200)
        .cookie("token",token,{httpOnly:true,secure:true,sameSite:"None"})
        .cookie("refreshToken",newrefreshToken,{httpOnly:true,secure:true,sameSite:"None"})
        .send("token generation sucessful")
    }
    catch(error){
        console.log(error)
        return res.status(500).send("an error occured")
    }
    
}

const getProfile=async (req,res)=>{
    try{
        const {token}=req.cookies
        const {_id}=jwt.verify(token,process.env.ENCRIPTION_KEY)
        const user=await User.findOne({_id})

        if(!user){
            return res.status(404).send("User Not Found")
        }
        res.status(200).send(user)
    }
    catch(err){
        res.status(500).send("error in getting info")
    }
}

export {register,login,logout,refresh,getProfile}