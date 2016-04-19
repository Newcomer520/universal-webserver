const Abnormals = module.exports = function() {}

Abnormals.prototype.fetch = function* (next) {
  this.body = 'fetch abnormals'
}
