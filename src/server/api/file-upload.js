import router from 'koa-router'
import parse from 'co-busboy'
import fs from 'fs'
import path from 'path'

const fileUploadRouter = router()

fileUploadRouter.post('/', function* (next) {
	if (!this.request.is('multipart/*')) {
		this.throw('cannot parse the content of file upload.', 400)
		// return yield next
	}
	console.log('files uploading...')
	const parts = parse(this, { autoFields: true })
	let part
	while(part = yield parts) {
		const filepath = path.join(__dirname, '../../..', 'tmp', part.filename)
		const stream = fs.createWriteStream(filepath)
		part.pipe(stream)
		console.log('uploading %s -> %s', part.filename, stream.path)

	}
	this.body = 'ok'
})


export default fileUploadRouter
