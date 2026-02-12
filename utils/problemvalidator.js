import Problems from "../models/problems.models.js"
import { verifyTestCases } from "./TestcaseValidators.js"
import { submitBatch } from "./submitBatch.utils.js"

export default async function problemValidator(passedobj){

    const {slug,title,difficulty,statement,constraints,description,topics,followUpQuestions,tags,testCases,solutions}=passedobj
    const existingProblem=await Problems.findOne({slug})

    if(existingProblem){
        throw new Error("Problem with this slug already exists")
    }

    if(!slug || !title || !difficulty || !statement || !constraints || !description || !topics || !followUpQuestions || !tags){
        throw new Error("please fill all the feilds")
    }

    if(slug.length<=5 || slug.length>=60){
        throw new Error("Slug should be between 5-60 characters")
    }

    if(title.length<=5 || title.length>=60){
        throw new Error("title should be between 5-60 characters")
    }

    if(statement.length<10 || statement.length>=500){
        throw new Error("problem statement should be between 10-500 characters")
    }

    if(description.length>=500){
        throw new Error("description cant be greater than 500 characters")
    }

    const submissionarr=solutions.map((solution)=>{
        verifyTestCases(testCases,solution)
    })

    const submissionReasult=await submitBatch(submissionarr)

    return {slug,title,difficulty,statement,constraints,description,topics,followUpQuestions,tags,testCases,solutions}
}