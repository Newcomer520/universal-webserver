const Records = module.exports = function() {}

Records.prototype.list = function* (next) {
  this.body = 'list records'
}

Records.prototype.fetch = function* (next) {
  this.body = 'fetch records'
}
