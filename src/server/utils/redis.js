import redis from 'redis'
import bluebird from 'bluebird'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const { redisIp, redisPort } = global.config
const log = type => () => console.log(type, arguments)


const client = redis.createClient({ host: redisIp, port: redisPort, max_attempts: 10 })

// client.on('connect', log('connect'))
// client.on('ready', log('ready'))
// client.on('reconnecting', log('reconnecting'))
client.on('error', () => console.log(`failed to connect redis server: ${redisIp}:${redisPort}`))
client.on('end', () => console.log('redis end'))
process.on('exit', code => {
	console.log('redis exit....')
	client.end()
})

export default client
