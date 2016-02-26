export default function *(next) {
  try {
    yield next
  } catch (err) {
    this.status = err.status || err.statusCode || 500
    this.response.type = 'application/json'
    this.response.body = JSON.stringify(err.message)
    this.app.emit('error', err, this)
  }
}
