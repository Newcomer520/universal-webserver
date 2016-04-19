const ExamItems = module.exports = function() {}

ExamItems.prototype.fetch = function* (next) {
  this.body = 'fetch exam-items'
}
