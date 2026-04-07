import { User } from "../models/users.model.js"
import isValidRegisteration from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Refreshtokens from "../models/refreshToken.model.js"
import client from "../config/redisconnect.js"
import Submissions from "../models/submissions.models.js"
import ResetToken from "../models/resetTokens.models.js"
import crypto from "crypto"
import { sendEmail } from "../utils/emailsender.js"
import validator from "validator"

const register=async (req,res)=>{
    try{
        try{isValidRegisteration(req,res)}
        catch(error){console.log({error});return res.status(400).send({msg:"user registred failed",error:error.message || error || "Ensure all feilds are filled correctly"})}
        const {username,email,password}=req.body
        const hashedpassword=await bcrypt.hash(password,10)
        const existingUser=await User.findOne({
                $or:[{username},{email}]
        })
        if(existingUser){
            return res.status(400).send({msg:"user already exists",error:error.message || error || "user already exists"})
        }
        
        const newuser=await User.create({username,email,password:hashedpassword,role:"User"})

        const token=jwt.sign({_id:newuser._id,role:newuser.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
        const refreshToken=jwt.sign({_id:newuser._id,role:newuser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
        await Refreshtokens.create({user:newuser._id,refreshToken:refreshToken})

        res.cookie("acesstoken",token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:"None"})
        res.cookie("refreshToken",refreshToken,{maxAge:60*60*1000*24*30,httpOnly:true,secure:true,sameSite:"None"})
        return res.status(201).send({msg:"user registred sucessful",data:{username:newuser.username,email:newuser.email,role:newuser.role}})
    }
    catch(error){
        res.status(500).send({msg:"an error occured",error:error.message || error || "An Error Occured"})
    }
}

const login=async (req,res)=>{
    try{
        console.log({incomingData:req.body})
        const {login,password}=req.body
        const query=login.includes("@") ? {email:login} :{username:login}
        console.log({query})
        if(!login || !password){
            return res.status(400).send("Fill Out all the feilds") 
        }
        
        const existinguser=await User.findOne(query).select("+password")


        if(!existinguser){
            return res.status(400).send("Invalid Credentials!")
        }

        else{
            const acess=await bcrypt.compare(password,existinguser.password)
            if(!acess){
                return res.status(400).send("Invalid Credentials!")
            }

            const token=jwt.sign({_id:existinguser._id,role:existinguser.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
            const refreshToken=jwt.sign({_id:existinguser._id,role:existinguser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
            await Refreshtokens.create({user:existinguser._id,refreshToken:refreshToken})

            res.cookie("token",token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:"None"})
            res.cookie("refreshToken",refreshToken,{maxAge:60*60*1000*24*30,httpOnly:true,secure:true,sameSite:"None"})
            console.log("acess granted")
            return res.status(200).send({msg:"login Sucessful",data:{username:existinguser.username,email:existinguser.email,role:existinguser.role}})
        }
    }
    catch(error){
        console.log("error in login",error)
        res.status(500).send({msg:"error in logging you in",error:error.message||error||"an error occured"})
    }
}

const checkAuth=async (req,res)=>{
    try{
        if(req.user){
            const {user}=req
            res.status(200).send({msg:"sucess",data:{username:user.username,email:user.email,role:user.role}})
        }
    }
    catch(error){
        console.log("error occured in check auth",error)
        res.status(500).send({msg:"an error occured",error:error.message||error||"an error occured"})
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

const deleteProfile=async (req,res)=>{
    try{
        const {_id:userId}=req.user
        await User.findOneAndDelete({_id:userId})
        res.status(200).send({msg:"deleted sucessfuilly"})
    }
    catch(error){
        res.status(500).send({error:error.message||"a problem occured in deleteing your accounnt"})
    }
}

const forgetPassword=async (req,res)=>{

    console.log("forget password route hit")

    try{
    // email take and verify
    const {email}=req.body

    if (!email){
        return res.status(404).send({success:false,error:"Please Enter a Email"})
    }
    
    const user=await User.findOne({email})

    if (!user){
        return res.status(404).send({success:false,error:"Invalid Email"})
    }

    //generate a random token
    const resetToken=crypto.randomBytes(32).toString('hex')

    const hashedResetToken=crypto.createHash("sha256").update(resetToken).digest("hex")

    

    const resetUrl=`${req.protocol}://${req.get("host")}/resetpassword/${resetToken+':'+user._id}`

    try{
        await sendEmail(null,null,'t92135422@gmail.com',resetUrl)
    }
    catch(error){
        console.log({EMAIL_SENDING_ERROR:error})
        return res.status(500).send({success:false,error:"sorry the password reset email couldnt be sent please try again later"})
    }

    await ResetToken.create({user:user._id,token:hashedResetToken})

    console.log({ResetToken,userId:user._id})

    res.status(200).send({success:true,data:resetUrl})
    }
    catch(error){
        console.log({ERROR_IN_FORGET_PASSWORD_ROUTE:error})
        res.status(500).send({success:false,error:error.message || "An Error Occured In Resetting Password"})
    }
}

const resetPassword=async (req,res)=>{
    console.log("reset password route hit")
    try{
    //verify the user token
        const {tokenAndId}=req.params

        if(!req.body.newPassword){
            return res.status(400).send({success:false,error:"Please ENter a password"})
        }

        const {newPassword}=req.body

        const token=tokenAndId.split(":")[0]

        const userId=tokenAndId.split(":")[1]

        const hashedResetTokenarray=await ResetToken.find({user:userId})

        console.log({hashedResetTokenarray})

        const recievedTokenHash=crypto.createHash("sha256").update(token).digest("hex")

        const foundToken=hashedResetTokenarray.find((token)=> token.token==recievedTokenHash)

        if(!foundToken){
            return res.status(401).send({success:false,error:"The Link Isnt Valid Please send reset link again"})
        }
        
        const tokenValidity = Date.now() - new Date(foundToken.createdAt).getTime();

        if(tokenValidity>1000*60*10){
            await ResetToken.deleteMany({user:foundToken.user})
            return res.status(401).send({success:false,error:"The Link Isnt Valid Please send reset link again"})
        }

        if(!validator.isStrongPassword(newPassword)){
            return res.status(400).send({success:false,error:"Please Choose A Strong Password"})
        }

        const hashedpassword=await bcrypt.hash(newPassword,10)  
        
        
        await User.findOneAndUpdate({_id:foundToken.user},{password:hashedpassword})
        

        return res.status(200).send("sucess")
    }
    catch(error){
        console.log({PASSWORD_RESET_ERROR:error})
        res.status(500).send({success:false,error:error.message || "An Error Occured In Resetting Password"})
    }
}

export {register,login,logout,refresh,getProfile,deleteProfile,checkAuth,forgetPassword,resetPassword}