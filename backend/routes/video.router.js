import express from "express"
import { userAuth } from "../middlewares/auth.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"
import { deleteVideo, getUploadSignature, saveMetaData } from "../controllers/video.controllers.js"


const videoRouter=express.Router()

//get Digital Singature

videoRouter.get("/getDigitalSignature/:problemId",adminMiddleware,getUploadSignature)


//save Meta Data
videoRouter.post("/saveMetaData",adminMiddleware,saveMetaData)

//delete 

videoRouter.delete("/deleteVideo/:problemId",adminMiddleware,deleteVideo)


export {videoRouter}