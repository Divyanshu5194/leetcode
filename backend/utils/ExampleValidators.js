import Examples from "../models/example.models.js"
export function ExampleValidator(examplearr){
    for ( const {input,output} of examplearr){
        if( input===undefined || output===undefined){
            throw new Error("please enter all valid Examples")
        }
    }
    if(examplearr.length<2){
        throw new Error("atleast 2 Examples are required")
    }
}

export async function insertExampleCases(examplearr,problemid,userid) {
    for (const example of examplearr){
        example.problem=problemid
        example.createdBy=userid
    }
    await Examples.insertMany(examplearr)
}