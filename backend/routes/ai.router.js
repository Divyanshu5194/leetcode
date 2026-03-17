import express from "express"
import { userAuth } from "../middlewares/auth.js"
import { aiChat } from "../controllers/chat.controllers.js"

const aiRouter=express.Router()

aiRouter.post("/chat",userAuth,aiChat)


export {aiRouter}