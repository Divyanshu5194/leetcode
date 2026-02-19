import mongoose, { Schema } from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:3,
        maxLength:80,
        unique:true
    },
    email:{
        type:String,
        required:true,
        maxLength:256,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    password:{
        type:String,
        select:false,
        required:true
    },
    rating:{
        type:Number,
        max:9000
    },
    bio:{
        type:String,
        maxLength:300
    },
    role:{
        type:String,
        enum:["User","Admin"],
        required:true,
        default:"User"
    },
    solved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"Problems",
            unique:true
        }]
    }
},{timestamps:true})

userSchema.post("findOneAndDelete",async (document)=>{
    if(doc){
        await mongoose.model("Submissions").deleteMany({_id:document._id})
        await mongoose.model("Refreshtokens").deleteMany({_id:document._id})
    }
})

export const User=mongoose.model("User",userSchema)