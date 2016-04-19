const ExamReports = module.exports = function() {}

ExamReports.prototype.fetch = function* (next) {
  this.body = 'fetch exam-reports'
}

ExamReports.prototype.list = function* (next) {
  this.body = 'list exam-reports'
}
