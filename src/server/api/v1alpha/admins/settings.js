const Settings = module.exports = function() {}

Settings.prototype.fetch = function* (next) {
  this.body = 'fetch settings'
}

Settings.prototype.update = function* (next) {
  this.body = 'update settings'
}
