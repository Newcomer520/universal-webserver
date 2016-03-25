import router from 'koa-router'
import fetch from 'isomorphic-fetch'

const apiUrl = 'http://210.200.13.224:10080/actual'
const actualRouter = new router()

actualRouter.get('/', function* (next) {
	try {
		const result = yield fetchActual()
		console.log(result)
		this.body = result
	} catch (error) {
		this.throw(error, 500)
	}
})

const fetchActual = () => done => {
	const options = {
		headers: {
			'Content-Type': 'application/octet-stream'
		},
		method: 'get'
	}
	fetch(apiUrl, options)
		.then(response => {
			if (response.status != 200) {
				error = new Error('Failed to get api data')
				error.response = response
				throw error
			}
			return resolveBuffer(response.body)
		})
		.then(buf => done(null, buf))
		.catch(error => error.response.text())
		.then(errMsg => done(errMsg, null))

}

const resolveBuffer = body => new Promise((resolve, reject) => {
	const chunks = []
	body.on('data', chunk => {
		chunks.push(chunk)
	});

	body.on('end', () => {
		const buffer = Buffer.concat(chunks)
		resolve(buffer)
	})
	body.on('error', (e) => {
		reject(e)
	})
})

export default actualRouter
