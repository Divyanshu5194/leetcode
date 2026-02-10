import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

export default async function mongodb(){
    const mongodbUrl=process.env.MONGODB_CONNECTION_URL
    const dbname="leetcode"
    const connectionUrl=`${mongodbUrl}/${dbname}`

    try{
        await mongoose.connect(connectionUrl)
        console.log("connected to mongodb sucessfully")
    }
    catch(error){
        console.log("error connectiong to db",error)
        process.exit(1)
    }
}