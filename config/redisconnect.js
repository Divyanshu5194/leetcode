import redis from "redis"

const redisCoennct=async () => {
  try{
    const client=redis.createClient({
    username: 'default',
    password: process.env.REDDIS_PASSWORD,
    socket: {
        host: process.env.REDDIS_HOST,
        port: 13267
    }
})
    await client.connect()
    console.log("Redis Connection Sucessful")
    return client
  }
  catch(error){
    console.log(error)
    process.exit(1)
  }
}
const client=redisCoennct()

export default client