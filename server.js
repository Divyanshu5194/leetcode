import express from "express"
import mongodb from "./config/mongodb.js"
import client from "./config/redisconnect.js"
import dns from "node:dns/promises";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dns.setServers(["1.1.1.1"]);


dotenv.config();
const app=express();
const PORT=4000;

(async ()=>{
    try{
        await mongodb()
        await client
        server()
    }
    catch(error){
        console.log(`Error in server :${error}`)
    }
})();

function server(){
    app.use(express.json())
    app.use(cookieParser())

    app.listen(PORT,()=>{
        console.log(`server listening on port :${PORT}`)
    })
}

