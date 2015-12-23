/**
 * authentication related helper
 */
import crypto from 'crypto'
import request from 'request'
import config from '../../config'

const algorithm = 'aes-256-ctr'

const elUrl = Symbol('elasticsearch-url')
const elPort = Symbol('elasticsearch-port')

class Elasticsearch {
	constructor(url, port) {
		this[elUrl] = url
		this[elPort] = port
	}
	encrypt(text) {
		const cipher = crypto.createCipher(algorithm, config.secret)
		let crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex')
		return crypted
	}
	decrypt(text) {
		const decipher = crypto.createDecipher(algorithm, config.secret)
		let dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8')
		return dec
	}
	authenticate(username, password) {
		return new Promise((resolve, reject) => {
			const options = {
				url: `http://${this[elUrl]}:${this[elPort]}`,
				auth: {
					username: username,
					password: password
				}
			}
			request(options, (err, response, body) => {
				if (err) {
					reject({ stausCode: 500, message: err })
				} else if (response.statusCode != 200) {
					reject({ statusCode: response.statusCode, message: JSON.parse(body).error })
				} else {
					resolve({ statusCode: 200, mesage: body, secret: this.encrypt(password) })
				}
			})
			// request.get(`http://${this[elUrl]}:this[elPort]`).auth(username, password)
		})
	}
	getApi(api, username, password) {

	}
}

export default function(url, port) {
	return new Elasticsearch(url, port)
}
