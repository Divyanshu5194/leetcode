import Problems from "../models/problems.models.js"
import Submissions from "../models/submissions.models.js"
import TestCases from "../models/testcases.models.js"
import { User } from "../models/users.model.js"
import { submitToken } from "../utils/submitBatch.utils.js"
import { verifyTestCases } from "../utils/TestcaseValidators.js"

const submit=async (req,res)=>{
    try{
        const {user} =req
        const {_id:userId}=user
        const {slug,solution}=req.body
        const propblem=await Problems.findOne({slug})
        const {_id:problemId,boilerPlateCodes}=propblem
        if(!problemId||!solution.code||!solution.language){
            throw new Error("please ensure all feilds are filled")
        }
        const testCases=await TestCases.find({problem:problemId})
        const {_id:submissionId}=await Submissions.create({problem:problemId,user:userId,language:solution.language,code:solution.code,timeForExecution:0,status:"Pending",memoryUsedInExecution:0,testCasesPassed:0,totalTestCases:0})
        res.status(201).send("code submitted sucessfully")
        const tokenstr=await verifyTestCases(testCases,solution,boilerPlateCodes)
        const results=await submitToken(tokenstr)
        const runInfo={}
        for (const reasult of results){
            console.log(reasult)
            if(reasult.status.id==3){
                runInfo.timeForExecution=runInfo.timeForExecution+Number(reasult.time) || Number(reasult.time)
                runInfo.memory = (runInfo.memorty)?(Math.max(runInfo.memorty,reasult.memory)):(reasult.memory)
            }
            runInfo.status=reasult.status.description
            if(reasult.status.id!=3){reasult=null}
        }
        console.log({runInfo})
        const update={problem:problemId,user:userId,language:solution.language,code:solution.code,timeForExecution:runInfo.timeForExecution,status:runInfo.status,memoryUsedInExecution:runInfo.memory,testCasesPassed:results.length}
        console.log({update})
        await Submissions.findOneAndUpdate({_id:submissionId},update)
        user.solved.includes(problemId)


        if (results.length==testCases.length && !user.solved.includes(problemId)){
            const {solved}=user
            solved.push(problemId)
            await user.save()
        }

    }
    catch(error){
        console.log(error)
        res.status(500).send({msg:"an error occured",error:error.message||"an error occured",data:null})
    }
}

const runCode=async (req,res)=>{
    try{
        console.log({RUNCODE_INPUT_:req.body.solution.code})
        const {user} =req
        const {_id:userId}=user
        const {slug,solution}=req.body
        const propblem=await Problems.findOne({slug})
        const {_id:problemId,boilerPlateCodes}=propblem
        if(!problemId||!solution.code||!solution.language){
            throw new Error("please ensure all feilds are filled")
        }
        const testCases=await TestCases.find({problem:problemId})
        const tokenstr=await verifyTestCases(testCases,solution,boilerPlateCodes)
        const results=await submitToken(tokenstr)
        //console.log({RUN_RESULTS:results})
        for (let result of results){
            //console.log({REASULT_STATUS_DESC:result.status.description})
            
            if(result.status.id!=3){
                return res.status(400).send({msg:"error occured",data:result.status.description})
            }
        }
        console.log({RUN_RESULTS:results})
        res.status(200).send({msg:"Sucess",data:results})
    }
    catch(error){
        console.log("error in running code")
        res.status(500).send({msg:"error occured",error:error.message||"unable to run your code"})
    }
}



export {submit,runCode}