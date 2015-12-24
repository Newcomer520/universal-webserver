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
client.on('error', log('error'))
client.on('end', log('end'))
process.on('exit', code => {
	console.log('redis exit....')
	client.end()
})

export default client
