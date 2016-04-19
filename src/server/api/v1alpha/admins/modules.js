const Modules = module.exports = function() {}

Modules.prototype.list = function* (next) {
  this.body = 'list modules'
}

Modules.prototype.import = function* (next) {
  this.body = 'import modules'
}
