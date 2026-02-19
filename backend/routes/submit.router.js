import express from "express"
import { runCode, submit } from "../controllers/submit.controllers.js"
import { userAuth } from "../middlewares/auth.js"

const submitRouter=express.Router()

submitRouter.post("/submit",userAuth,submit)

submitRouter.post("/run",userAuth,runCode)

export {submitRouter}