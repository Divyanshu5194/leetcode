import express from "express"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"
import { userAuth } from "../middlewares/auth.js"
import { createProblem, deleteProblem, getAllProblems, getAllSolvedSubmissions, getAllSubmissions, getASpecificProblem, updateProblem} from "../controllers/admin.controllers.js"

const problemsRouter=express.Router()

//create

problemsRouter.post("/create",adminMiddleware,createProblem)

//update

problemsRouter.patch("/update/:slug",adminMiddleware,updateProblem)

//delete
problemsRouter.delete("/delete/:slug",adminMiddleware,deleteProblem)

//viewall
problemsRouter.get("/all",userAuth,getAllProblems)

//get a specific problem
problemsRouter.get("/:slug",userAuth,getASpecificProblem)

//get solved problems
problemsRouter.get("/submissions",userAuth,getAllSubmissions)

problemsRouter.get("/solved",userAuth,getAllSolvedSubmissions)

export {problemsRouter}