import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        minLength:3,
        maxLength:80,
        unique:true
    },
    email:{
        type:String,
        require:true,
        maxLength:256,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    password:{
        type:String,
        select:false,
        require:true
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
        require:true,
        default:"User"
    },
    solved:{
        type:[string]
    }
},{timestamps:true})

export const User=mongoose.model("User",userSchema)