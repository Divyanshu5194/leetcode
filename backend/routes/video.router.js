import express from "express"
import { userAuth } from "../middlewares/auth.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"
import { checkExistingVideo, deleteVideo, getUploadSignature, saveMetaData } from "../controllers/video.controllers.js"


const videoRouter=express.Router()

//get Digital Singature

videoRouter.get("/getDigitalSignature/:problemId",adminMiddleware,getUploadSignature)

//check if video exists
videoRouter.get("/checkVideoExistannce/:problemId",userAuth,checkExistingVideo)


//save Meta Data
videoRouter.post("/saveMetaData",adminMiddleware,saveMetaData)

//delete 

videoRouter.delete("/deleteVideo/:problemId",adminMiddleware,deleteVideo)


export {videoRouter}