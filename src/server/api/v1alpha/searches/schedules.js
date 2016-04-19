const Schedules = module.exports = function() {}

Schedules.prototype.list = function* (next) {
  this.body = 'list schedules'
}
