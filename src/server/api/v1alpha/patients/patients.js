const Patients = module.exports = function() {}

Patients.prototype.list = function* (next) {
  this.body = 'list patients'
}
