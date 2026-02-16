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
        enum:[
            "IN_QUEUE",
            "PROCESSING",
            "ACCEPTED",
            "WRONG_ANSWER",
            "TIME_LIMIT_EXCEEDED",
            "COMPILATION_ERROR",
            "RUNTIME_ERROR_SIGSEGV",
            "RUNTIME_ERROR_SIGABRT",
            "MEMORY_LIMIT_EXCEEDED",
            "OUTPUT_LIMIT_EXCEEDED",
            "INTERNAL_ERROR",
            "EXEC_FORMAT_ERROR"
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