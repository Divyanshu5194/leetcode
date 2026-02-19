import express from "express"
import { checkAuth, deleteProfile, getProfile, login, logout, refresh, register} from "../controllers/userAuth.controllers.js"
import { userAuth } from "../middlewares/auth.js"
import { adminRegister } from "../controllers/admin.controllers.js"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

const userRouter=express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/refresh",refresh)
userRouter.get("/me",userAuth,getProfile)
userRouter.delete("/delete",userAuth,deleteProfile) 
userRouter.get("/checkAuth",userAuth,checkAuth)

userRouter.post("/admin/register",adminMiddleware,adminRegister)




export {userRouter}