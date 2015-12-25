/**
 * authentication related helper
 */
import request from 'request'
import authHelper from './server-auth-helper'

const elUrl = Symbol('elasticsearch-url')
const elPort = Symbol('elasticsearch-port')

class Elasticsearch {
	constructor(url, port) {
		this[elUrl] = url
		this[elPort] = port
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
					reject({ statusCode: 500, message: err.toString() })
				} else if (response.statusCode != 200) {
					reject({ statusCode: response.statusCode, message: JSON.parse(body).error })
				} else {
					resolve({ statusCode: 200, mesage: body, secret: authHelper.encrypt(password) })
				}
			})
		})
	}
	getApi(api, username, password) {

	}
}

export default function(url, port) {
	return new Elasticsearch(url, port)
}
