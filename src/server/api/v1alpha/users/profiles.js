const Profiles = module.exports = function() {}

Profiles.prototype.fetch = function* (next) {
  this.body = 'fetch profiles'
}
