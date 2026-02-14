import Solutions from "../models/solution.models.js"

export function solutionValidator(solutionarr){
    for ( const {solution,language} of solutionarr){
        if(solution.length>1000){
            throw new Error("solution cant be greater than 1000 characters")
        }
        if(!language){
            throw new Error("language is required")
        }
    }
    if(solutionarr.length<1){
        throw new Error("atleast 1 solution is required")
    }
}

export async function insertSolutions(solutionarr,problemid,userid){
    for (const solution of solutionarr){
        solution.createdBy=userid
        solution.problem=problemid
    }
    await Solutions.insertMany(solutionarr)
}