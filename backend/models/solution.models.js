import { Schema,model } from "mongoose";

const solutionSchema=new Schema({
    problem:{
        type:Schema.Types.ObjectId,
        ref:"Problems",
        required:true
    },
    language:{
        type:String,
        required:[true,"language is required"]
    },
    solution:{
        type:String,
        maxLength:1000,
        required:[true,"atleast 1 solution must be present"]
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
},{timestamps:true})

const Solutions=model("Solutions",solutionSchema)

export default Solutions