const About = module.exports = function() {}

About.prototype.fetch = function* (next) {
  this.body = 'fetch about'
}
