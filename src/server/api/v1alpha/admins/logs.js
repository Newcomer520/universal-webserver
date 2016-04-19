const Logs = module.exports = function() {}

Logs.prototype.fetch = function* (next) {
  this.body = 'fetch logs'
}
