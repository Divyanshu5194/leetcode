import express from "express"
import mongodb from "./config/mongodb.js"
import client from "./config/redisconnect.js"
import dns from "node:dns/promises";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/userAuth.router.js";
import rateLimiter from "./middlewares/rateLimiter.js"
import { problemsRouter } from "./routes/problems.router.js";
import { languageListFetcher } from "./utils/languagefetcher.js";
dns.setServers(["1.1.1.1"]);


dotenv.config();
const app=express();
const PORT=4000;

(async ()=>{
    try{
        await Promise.all([mongodb(),client,languageListFetcher()])
        server()
    }
    catch(error){
        console.log(`Error in server :${error}`)
        process.exit(1)
    }
})();

function server(){
    app.use(express.json())
    app.use(cookieParser())
    app.use(rateLimiter)

    app.use(userRouter)
    app.use("/problems",problemsRouter)

    app.listen(PORT,()=>{
        console.log(`server listening on port : ${PORT}`)
    })
}

