import mongoose, { Schema } from "mongoose";


const RefreshtokensSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true,
        select:false
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

const Refreshtokens=mongoose.model("Refreshtokens",RefreshtokensSchema)

export default Refreshtokens