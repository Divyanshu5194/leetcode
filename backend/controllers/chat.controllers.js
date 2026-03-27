import { getGeminiResponse } from "../utils/aiModel.js"

const aiChat=async (req,res)=>{
    const {contents,description,statement}=req.body;
    try{
        console.log({contents})
        const aiResponse=await getGeminiResponse(contents,description,statement);
        console.log({aiResponse})
        res.send({sucess:true,data:aiResponse})
    }
    catch(error){
        console.log(error.message)
        res.status(500).send({sucess:false,error:error.message||error||"an error occured"})
    }
}

export {aiChat}