import redis from 'redis'
import bluebird from 'bluebird'
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const { redisIp, redisPort } = global.config
const log = type => () => console.log(type, arguments)


var client

// client.on('connect', log('connect'))
// client.on('ready', log('ready'))
// client.on('reconnecting', log('reconnecting'))

export default client

export const initRedis = () => (done) => {
	client = redis.createClient({ host: redisIp, port: redisPort, max_attempts: 10 })
	client.on('ready', () => {
		console.info('redis connected.')
		done()
	})
	client.on('error', () => console.log(`failed to connect redis server: ${redisIp}:${redisPort}`))
	client.on('end', () => console.log('redis end'))
	process.on('exit', code => {
		console.log('redis exit....')
		client.end()
	})
}
