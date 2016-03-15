import redis from 'redis'
import bluebird from 'bluebird'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const { redisIp, redisPort } = global.config
const log = type => () => console.log(type, arguments)




// client.on('connect', log('connect'))
// client.on('ready', log('ready'))
// client.on('reconnecting', log('reconnecting'))

const client = redis.createClient({ host: redisIp, port: redisPort, max_attempts: 10 })
export default client

// use this flag to check if redis connected
let redisConnected = false
client.on('ready', () => redisConnected = true )

export const initRedis = () => (done) => {

	client.on('ready', () => {
		console.info('redis connected.')
		done()
	})
	client.on('error', () => console.log(`failed to connect redis server: ${redisIp}:${redisPort}`))
	client.on('end', () => console.log('redis end'))
	if (redisConnected) {
		done()
	}
	process.on('exit', code => {
		console.log('redis exit....')
		client.end()
	})
}
