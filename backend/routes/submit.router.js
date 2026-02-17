import express from "express"
import { submit } from "../controllers/submit.controllers.js"
import { userAuth } from "../middlewares/auth.js"

const submitRouter=express.Router()

submitRouter.post("/submit",userAuth,submit)


export {submitRouter}