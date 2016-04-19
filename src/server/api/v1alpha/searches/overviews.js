const Overviews = module.exports = function() {}

Overviews.prototype.fetch = function* (next) {
  this.body = 'fetch overviews'
}
