import jwt from "jsonwebtoken"
import { User } from "../models/users.model.js"
import client from "../config/redisconnect.js"

const adminMiddleware=async function(req,res,next){
  try{
    const redisClient=await client
    const {token}=req.cookies
  
    if(!(token)){
      return res.status(401).send("Please Log In first")
    }

    const isBlocked=await redisClient.exists(`token : ${req.cookies.token}`)

    if(isBlocked){
      throw new Error("Acesss Denied using old token")
    }

    let _id;

      try{
        const payload=jwt.verify(token,process.env.ENCRIPTION_KEY)
        _id=payload._id;
      }
      catch(error){
        return res.status(401).send("invalid token")
      }

    if(!_id){
      throw new Error("No Id Provided")
    }
    const user=await User.findById(_id)
    req.user=user
    if(user){
      if(user.role=="Admin"){
        next()
      }
      else{
        return res.status(401).send("invalid token")
      }
    }
    else{
      return res.status(404).send("User not found")
    }
  }
  catch(error){
    res.status(500).send("Error "+error.message)
  }
}

export {adminMiddleware}