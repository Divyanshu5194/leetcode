import Problems from "../models/problems.models.js"
import TestCases from "../models/testcases.models.js"
import { getIdOfLanguage, languageListFetcher } from "./languagefetcher.js"
import { submitBatch } from "./submitBatch.utils.js"

export function testcaseValidator(testCases){
    for ( const {input,output,isHidden} of testCases){
        if(input === undefined || output ===undefined || isHidden===undefined || output.dataType==undefined || output.value==undefined){
            throw new Error("please ensure all feilds are filled")
        }
    }
    if(testCases.length<2){
        throw new Error("atleast 2 test cases are required")
    }
}

export async function verifyTestCases(testCases,Solution,boilerPlateCodes){
    const lannguages=await languageListFetcher();

    const languageId=getIdOfLanguage(lannguages,Solution.language)

    const typeCaster={
        Number:(value)=>Number(value),
        Boolean:(value)=>Boolean(value),
        String:(value)=>String(value),
        Array:(value)=>Array(value),
    }
    
    const submissions=testCases.map(({input,output})=>{
        const inputvalue=input.map((inputobj)=>{
            return typeCaster[inputobj.dataType](inputobj.value)
        })
        const languageName=Solution.language.split(" ")[0]
        const boilerPlateCode=boilerPlateCodes.find(({language})=>language==languageName)
        const expected_output_value=typeCaster[output.dataType](output.value)
        
        return {
        language_id:languageId, 
        source_code:Solution.solution,
        stdin:inputvalue.join(" "),
        expected_output:expected_output_value,
    }})
    console.log({submissions})

    const submitReasult =await submitBatch(submissions)
    
    let tokenstr="";

    submitReasult.forEach((token)=>{tokenstr+=`${token.token},`})

    return tokenstr
}

export async function insertTestcases(testCases,problemid,userid){
    for (const testcase of testCases){
        testcase.problem=problemid
        testcase.createdBy=userid
    }
    await TestCases.insertMany(testCases)
}