import express from "express"
import { getProfile, login, logout, refresh, register} from "../controllers/userAuth.controllers.js"
import { userAuth } from "../middlewares/auth.js"

const userRouter=express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/refresh",refresh)
userRouter.get("/me",userAuth,getProfile)


export {userRouter}