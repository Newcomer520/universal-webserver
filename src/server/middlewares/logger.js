
import FileStreamRotator from 'file-stream-rotator'
var express = require('express')
var fs = require('fs')
var morgan = require('morgan')

var app = express()
const { logFolder } = global.config

// ensure log directory exists
fs.existsSync(logFolder) || fs.mkdirSync(logFolder)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logFolder + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD"
})

// setup the logger
const logger = morgan('combined', {stream: accessLogStream})
export default logger

