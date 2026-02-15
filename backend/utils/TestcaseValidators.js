import TestCases from "../models/testcases.models.js"
import { getIdOfLanguage, languageListFetcher } from "./languagefetcher.js"
import { submitBatch } from "./submitBatch.utils.js"

export function testcaseValidator(testCases){
    for ( const {input,output,isHidden} of testCases){
        console.log({condition: (!input || !output|| (isHidden===null))})
        if(input === undefined || output ===undefined || isHidden===undefined){
            throw new Error("please enter all valid test cases")
        }
    }
    if(testCases.length<2){
        throw new Error("atleast 2 test cases are required")
    }
    
}

export async function verifyTestCases(testCases,Solution){
    const lannguages=await languageListFetcher();

    const languageId=getIdOfLanguage(lannguages,Solution.language)
    
    const submissions=testCases.map(({input,output})=>{return {
        language_id:languageId,
        source_code:Solution.solution,
        stdin:input,
        expected_output:output
    }})

    const submitReasult =await submitBatch(submissions)
    
    let tokenstr="";

    submitReasult.forEach((token)=>{tokenstr+=`${token.token},`})

    console.log({VERIFY_TEST_CASES_TOKENSTR:tokenstr})

    return tokenstr
}

export async function insertTestcases(testCases,problemid,userid){
    for (const testcase of testCases){
        testcase.problem=problemid
        testcase.createdBy=userid
    }
    await TestCases.insertMany(testCases)
}