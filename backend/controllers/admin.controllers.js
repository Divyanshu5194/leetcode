import Refreshtokens from "../models/refreshToken.model.js"
import isValidRegisteration from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/users.model.js"
import problemValidator from "../utils/problemvalidator.js"
import Problems from "../models/problems.models.js"
import { testcaseValidator , insertTestcases, verifyTestCases } from "../utils/TestcaseValidators.js"
import { ExampleValidator, insertExampleCases } from "../utils/ExampleValidators.js"
import { insertSolutions, solutionValidator } from "../utils/solutionValidators.js"
import { submitToken } from "../utils/submitBatch.utils.js"

const adminRegister=async (req,res)=>{
    try{
        isValidRegisteration(req,res)
        const {username,email,password}=req.body
        const hashedpassword=await bcrypt.hash(password,10)
        const existingUser=await User.findOne({
                $or:[{username},{email}]
        })
        if(existingUser){
            throw new Error("Users with the username or email already exists")
        }
        
        const newuser=await User.create({username,email,password:hashedpassword,role:"Admin"})

        const token=jwt.sign({id:newuser._id,role:newuser.role},process.env.ENCRIPTION_KEY,{expiresIn:"1h"})
        const refreshToken=jwt.sign({id:newuser._id,role:newuser.role},process.env.REFRESH_TOKEN_KEY,{expiresIn:"30d"})
        await Refreshtokens.create({user:newuser._id,refreshToken:refreshToken})

        res.cookie("acesstoken",token,{maxAge:60*60*1000,httpOnly:true,secure:true,sameSite:"None"})
        res.cookie("refreshToken",refreshToken,{maxAge:60*60*1000*24*30,httpOnly:true,secure:true,sameSite:"None"})
        return res.status(201).send("Admin Registeration sucessful")
    }
    catch(error){
        res.status(400).send(`Error in registration : ${error}`)
    }
}

const createProblem=async (req,res)=>{
    try{
        const {testCases,examples,solutions}=req.body
        testcaseValidator(testCases)
        ExampleValidator(examples)
        solutionValidator(solutions)
        const tokenarr=await Promise.all(solutions.map(async (solution)=>
            await verifyTestCases(testCases,solution)
        ))
        console.log({CREATE_PROBLEM_TOKENSTR:tokenarr})
        const reasults=await submitToken(tokenarr.join(","))
        console.log({reasults})
        const errorresults=[]
        reasults.forEach((reasult)=>{
            if(reasult && reasult.status.id!=3){
                errorresults.push(reasult.status)
            }
        })
        if(errorresults.length>1){
            return res.status(400).send(errorresults)
        }

        const {token}=req.cookies
        const {_id:adminId}=jwt.decode(token)
        const newProblem=await problemValidator({...req.body,createdBy:adminId,testCases,solutions})

        
        const {_id:problemid}=await Problems.create({...newProblem,createdBy:adminId})
        insertTestcases(testCases,problemid,adminId)
        insertExampleCases(examples,problemid,adminId)
        insertSolutions(solutions,problemid,adminId)
        res.status(201).send("New Problem Created Succesfully")
    }
    catch(error){
        console.log(error)
        return res.status(400).send({message:(error.message || "an error occured in creation of problem")})
    }
}

const getAllProblems=async (req,res)=>{
    try{
        const problems=await Problems.find({})
        const problemsToShow=[]
        for(const {title,difficulty} in problems){
            problemsToShow.push({title,difficulty})
        }
        res.status(200).send(problemsToShow)
    }
    catch(error){
        res.status(500).send({message:error.message || "error in fetching problems"})
    }
}

const getASpecificProblem=async (req,res)=>{
    const {slug}=req.params
    const problem=await Problems.findOne({slug})
    if(!problem){
        return res.status(404).send("problem not found")
    }
    else{
        problem.createdBy=undefined
        res.status(200).send(problem)
    }
}

export {adminRegister,createProblem,getAllProblems,getASpecificProblem}