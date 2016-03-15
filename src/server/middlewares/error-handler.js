export default function *(next) {
  try {
    yield next
  } catch (err) {
  	console.log('catch err: ', err, err.status, err.message)
    this.status = err.status || err.statusCode || 500
    this.response.body = err.message
    this.app.emit('error', err, this)
  }
}

export function *slackReportBot(next) {
	try {
		yield next
	} catch (err) {
		console.log('errbot')
		const payload = {
			'username': 'universal webserver bot',
			'icon_emoji': ':imp:',
	    'attachments': [
        {
        	fallback: `server gg: ${err.message}`,
          authur: `*${err.message}*`,
          title: `${this.request.method}: ${this.originalUrl}`,
          color: 'danger',
          pretext: "universal web server error occurred!",
          text: `${err.stack}`,
          mrkdwn_in: [
              // "text",
              // "pretext"
          ]
        }
	    ]
		}
		console.log(payload)
		replaceSpecials(payload.attachments[0])
		const result = yield sendToSlack(payload)
		this.throw(err)
		// console.log(result)
	}
}

function sendToSlack(payload) {
	console.log(payload)
	const url = global.config.slackWebHook
	return fetch(url, { body: JSON.stringify(payload), method:'post', headers: { 'Content-Type': 'application/json' } })
		.then(res => {
			if (res.status !== 200) {
				console.log('errr when sending to slack channel', res.status, res.statusText)
			}
			return res.text()
		})

}

function replaceSpecials(attachment) {
	for (let p in attachment) {
		if (typeof attachment[p] !== 'string') {
			continue
		}

		attachment[p] = attachment[p].replace(/&/g, '&amp;')
		attachment[p] = attachment[p].replace(/</g, '&lt;')
		attachment[p] = attachment[p].replace(/>/g, '&gt;')
	}
}
