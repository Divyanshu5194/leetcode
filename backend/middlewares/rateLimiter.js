import client from "../config/redisconnect.js";
import crypto from "crypto";

export default async function rateLimiter(req,res,next) {
    try{
        const redisClient=await client
        
        const key=String(req.ip)
        const currenttime=Math.floor(Date.now()/1000)

        const windowSize=3600
        const maxRequestsAllowed=100
        const windowTime=currenttime-windowSize;

        await redisClient.zRemRangeByScore(key,0,windowTime);
        const noOfRequests=await redisClient.zCard(key);

        if(noOfRequests>=maxRequestsAllowed){
            return res.status(429).send("You are rate limited")
        };

        const [str,lastAcessTime] = await redisClient.sendCommand([
            "ZREVRANGE",
            key,
            "0",
            "0",
            "WITHSCORES"
        ]);

        if(lastAcessTime && currenttime-lastAcessTime<2){
           return res.status(429).send("Please wait sometime before another request")
        }

        await redisClient.zAdd(key,[{score:currenttime,value:`${crypto.randomBytes(16).toString('hex')}`}])
        await redisClient.expire(key,windowSize)

        next()
    }
    catch(error){
        console.log("Error In Rate Limiter",error)
    }
}