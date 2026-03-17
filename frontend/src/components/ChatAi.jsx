import { useForm } from "react-hook-form"
import { Send } from 'lucide-react';
import { useState } from "react";
import { axiosClient } from "../utils/axiosClient";

export default function ChatAi({ description , statement }){
    const {register,handleSubmit,reset}=useForm()
    const [contents,setContents]=useState([{role:"Model",parts:[{text:"hello i am leetcode ai how may i help you?"}]}])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null)
    async function getAiResponse(contents){
        try{
            console.log({CONTENTS_TO_SEND:contents})
            setLoading(true)
            const {data:aiResponse}=await axiosClient.post("/ai/chat",{contents:contents,description,statement})
            const updatedContents=[...contents,{role:"Model",parts: [{ text: aiResponse.data }]}]
            setContents(updatedContents)
        }
        catch(error){
            setError(error.message || error || "an error occured")
        }
        finally{
            setLoading(false)
        }
    }
    const onSubmit = async (data)=>{
        console.log({data})
        const updatedContents=[...contents,{role:"User",parts: [{ text: data.message }]}]
        setContents(updatedContents)  
        reset()
        await getAiResponse(updatedContents)
        
    }

    return (
        <div className="relative h-full pt-3 overflow-scroll">
            {
                contents?.map((messageObject,i)=>(<div key={i+9908}>
                    <div className={messageObject.role=="Model" ? "chat chat-start" : "chat chat-end" }>
                        <div className="chat-bubble">
                            {messageObject.parts[0].text}
                        </div>
                    </div>
                </div>))
            }

            <div className="sticky flex align-middle w-full justify-center bottom-3  pt-3">
                <form className="sticky flex align-middle w-full justify-center bottom-3  pt-3" onSubmit={handleSubmit(onSubmit)}>
                    <input className="input" placeholder="Enter Message Here" {...register("message", { required: true ,minLength:2})} />

                    <button className="ml-2" type="submit" disabled={loading}>
                        <Send></Send>
                    </button>
                </form>
            </div>
        </div>
    )
}