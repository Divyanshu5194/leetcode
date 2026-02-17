import Problems from "../models/problems.models.js"
import Submissions from "../models/submissions.models.js"
import TestCases from "../models/testcases.models.js"
import { submitToken } from "../utils/submitBatch.utils.js"
import { verifyTestCases } from "../utils/TestcaseValidators.js"

export const submit=async (req,res)=>{
    try{
        const {user} =req
        const {_id:userId}=user
        const {problemId,solution}=req.body
        const {boilerPlateCodes}=await Problems.findById(problemId)
        if(!problemId||!solution.code||!solution.language){
            throw new Error("please ensure all feilds are filled")
        }
        const testCases=await TestCases.find({problem:problemId})
        const {_id:submissionId}=await Submissions.create({problem:problemId,user:userId,language:solution.language,code:solution.code,timeForExecution:"null",status:"PENDING",memoryUsedInExecution:"null",testCasesRun:"null"})
        const tokenstr=await verifyTestCases(testCases,solution,boilerPlateCodes)
        const result=submitToken(tokenstr)
        console.log({result})

        await Submissions.findOneAndUpdate({_id:submissionId},{problem:problemId,user:userId,language:solution.language,code:solution.code,timeForExecution,status,memoryUsedInExecution,testCasesRun})

    }
    catch(error){
        console.log(error)
        res.status(500).send({msg:"an error occured",error:error.message||"an error occured",data:null})
    }
}