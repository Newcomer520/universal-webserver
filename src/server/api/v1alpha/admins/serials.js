const Serials = module.exports = function() {}

Serials.prototype.fetch = function* (next) {
  this.body = 'fetch serials'
}

Serials.prototype.update = function* (next) {
  this.body = 'update serials'
}
