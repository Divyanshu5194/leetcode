import mongoose, { Schema } from "mongoose";


const resetTokenSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    token:{
        type:String
    }
},{timestamps:true})

const ResetToken=mongoose.model("ResetToken",resetTokenSchema)

export default ResetToken