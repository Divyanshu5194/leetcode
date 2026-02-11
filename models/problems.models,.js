import {Schema,model} from "mongoose";
import { PROBLEM_TAGS } from "../constants"

const problemsSchema=new Schema({
    slug:{
        type:String,
        required:[true,"slug is required"],
        maxLength:60,
        minLength:5,
        unique:[true,"Slug already present"]
    },
    title:{
        type:String,
        required:[true,"Title is required"],
        maxLength:60,
        minLength:5
    },
    difficulty:{
        type:String,
        required:[true,"Level is required"],
        enum: {
            values: ["Easy", "Medium", "Hard"],
            message: "Invalid problem type, it should be Easy, Medium, or Hard",
        }
    },
    statement:{
        type:String,
        required:[true,"problem statement is missing"],
        maxLength:[500,"problem statement cant be greater than 500 characters"],
        minLength:[30,"problem statement cant be less than 10 charatcers"]
    },
    constraints:{
        required:[true,"Constraints are required"],
        type:[{type:String,maxLength:100}],
        validate:{
            validator:arr=> !arr || arr.length<=10,
            message:"contraints can`t be greater than 10"
        }
    },
    description:{
        type:String,
        maxLength:500,
        required:[true,"description is required"]
    },
    topics:{
        required:[true,"topics are required"],
        type:[{type:String,maxLength:100}],
        validate:{
            validator:arr=> !arr || arr.length<=10,
            message:"topics should at max be 10"
        }
    },
    followUpQuestions:{
        type:[{type:String,maxLength:100}],
        validate:{
            validator:arr=>arr.length<=10,
            message:"follow up questions should at max be 10"
        }
    },
    tags:{
        required:[true,"tags are required"],
        enum:{
            values:PROBLEM_TAGS,
            message:"Invalid tag"
        }
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    }
},{timestamps:true})

const Problems=model("Problems",problemsSchema)

export default Problems