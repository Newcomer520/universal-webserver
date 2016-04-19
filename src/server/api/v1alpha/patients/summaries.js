const Summaries = module.exports = function() {}

Summaries.prototype.fetch = function* (next) {
  this.body = 'fetch summaries'
}
