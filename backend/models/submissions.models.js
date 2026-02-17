import { Schema,model } from "mongoose";

const submissionSchema=new Schema({
    problem:{
        type:Schema.Types.ObjectId,
        ref:"Problems",
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    language:{
        type:String,
        required:[true,"language is required"]
    },
    code:{
        type:String,
        maxLength:1000,
        required:[true,"atleast 1 solution must be present"]
    },
    timeForExecution:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Pending",
  "In Queue",
  "Processing",
  "Accepted",
  "Wrong Answer",
  "Time Limit Exceeded",
  "Compilation Error",
  "Runtime Error (SIGSEGV)",
  "Runtime Error (SIGXFSZ)",
  "Runtime Error (SIGFPE)",
  "Runtime Error (SIGABRT)",
  "Runtime Error (NZEC)",
  "Runtime Error (Other)",
  "Internal Error",
  "Exec Format Error"
],
        required:true
    },
    memoryUsedInExecution:{
        type:Number,
        required:true
    },
    testCasesRun:{
        type:Number,
        required:true
    }
},{timestamps:true})

const Submissions=model("Submissions",submissionSchema)

export default Submissions