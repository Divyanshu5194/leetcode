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
import Solutions from "../models/solution.models.js"
import TestCases from "../models/testcases.models.js"
import Submissions from "../models/submissions.models.js"

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
        const {testCases,examples,solutions,boilerPlateCodes}=req.body
        testcaseValidator(testCases)
        ExampleValidator(examples)
        solutionValidator(solutions)
        const tokenarr=await Promise.all(solutions.map(async (solution)=>
            await verifyTestCases(testCases,solution,boilerPlateCodes)
        ))
        const reasults=await submitToken(tokenarr.join(","))
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
        const problems=await Problems.find({}).select("title difficulty slug")
        res.status(200).send(problems)
    }
    catch(error){
        res.status(500).send({message:error.message || "error in fetching problems"})
    }
}

const getASpecificProblem=async (req,res)=>{
    const {slug}=req.params
    const problem=await Problems.findOne({slug}).select("-createdBy -solutions -__v -updatedAt")
    if(!problem){
        return res.status(404).send("problem not found")
    }
    else{
        problem.createdBy=undefined
        res.status(200).send(problem)
    }
}

const updateProblem=async (req,res)=>{
    try {
        const {slug}=req.params
        const problem=await Problems.findOne({slug})
        if(!problem){
            return res.status(404).send("problem not found")
        }
        const {updateObj}=req.body
        if(updateObj.testCases){
            const solution=Solutions.findOne({problem:problem._id})
            testcaseValidator(updateObj.testCases)

            const tokenarr=await Promise.all(solution.map(async (solution)=>
                await verifyTestCases(updateObj.testCases,solution)
            ))
            const reasults=await submitToken(tokenarr.join(","))
            const errorresults=[]
            reasults.forEach((reasult)=>{
                if(reasult && reasult.status.id!=3){
                    errorresults.push(reasult.status)
                }
            })
            if(errorresults.length>1){
                return res.status(400).send(errorresults)
            }
        }

        if(updateObj.solutions){
            const testCases=TestCases.findMany({problem:problem._id})
            const tokenarr=await Promise.all(updateObj.solutions.map(async (solution)=>
                await verifyTestCases(testCases,updateObj.solutions)
            ))
            const reasults=await submitToken(tokenarr.join(","))
            const errorresults=[]
            reasults.forEach((reasult)=>{
                if(reasult && reasult.status.id!=3){
                    errorresults.push(reasult.status)
                }
            })
            if(errorresults.length>1){
                return res.status(400).send(errorresults)
            }
        }
        if(updateObj.examples){
            ExampleValidator(updateObj.examples)
        }
        const updates={}

        const properties=["title","difficulty","statement","constraints","description","topics","followUpQuestions","tags","testCases","solutions"]
        for (let property of properties){
            updates[property]= updateObj[property] || problem[property]
        }
        console.log({updates})
        const updatedProblem=await Problems.findOneAndUpdate({slug},updates,{runValidators:true,new:true})
        return res.status(200).send({msg:"problem updated sucessfully ",updatedProblem})
    }
    catch(error){
        console.log(error)
        return res.status(500).send("An Error Occured In Updating the problem ",error)
    }
}

const deleteProblem=async (req,res)=>{
    try {
        const {slug}=req.params
        const problem=await Problems.findOne({slug})
        if(!problem){
            return res.status(404).send("problem not found")
        }
        await Problems.findOneAndDelete({slug})
        return res.status(200).send({msg:"Problem deteled sucessfully"})
    }
    catch(error){
        return res.status(500).send({msg:"An error occured In Deleting",error:error.message})
    }
}

const getAllSubmissions=async (req,res)=>{
    try{
        const {user}=req
        const {_id:userId}=user

        const submissions=await Submissions.find({user:userId})

        if(submissions.length==0){
            return res.status(404).send("No Submissions found")
        }
        return res.status(200).send(submissions)
    }
    catch(error){
        console.log(error)
        return res.status(500).send({msg:"An error occured",error})
    }
}

const getAllSolvedProblems=async (req,res)=>{
    
    try{
        const {_id:userId}=req.user
        const {solved:solved_Problems}=await User.findById(userId).populate({
            path:"solved",
            select:"_id slug title difficulty "
        })
        if(solved_Problems.length==0){
            return res.status(404).send("you havent solved any problems")
        }
        res.status(200).send({msg:"sucess",data:solved_Problems})
    }
    catch(error){
        res.status(500).send({msg:"cant get all solves problems",error:error.message||"a problem occured in getting all solved problems"})
    }
}

export {adminRegister,createProblem,getAllProblems,getASpecificProblem ,updateProblem,deleteProblem,getAllSubmissions,getAllSolvedProblems}