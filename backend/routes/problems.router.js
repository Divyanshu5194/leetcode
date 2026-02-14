import express from "express"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"
import { userAuth } from "../middlewares/auth.js"
import { createProblem, getAllProblems, getASpecificProblem } from "../controllers/admin.controllers.js"

const problemsRouter=express.Router()

//create

problemsRouter.post("/create",adminMiddleware,createProblem)

//update

//problemsRouter.patch("/update",adminMiddleware,updateProblem)

//delete
//problemsRouter.delete("/delete",adminMiddleware,deleteProblem)

//viewall
problemsRouter.get("/all",userAuth,getAllProblems)

//get a specific problem
problemsRouter.get("/:slug",userAuth,getASpecificProblem)

//get solved problems
//problemsRouter.get("/solved",userAuth,getAllSolvedProblems)

export {problemsRouter}