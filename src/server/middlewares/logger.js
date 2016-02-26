
import FileStreamRotator from 'file-stream-rotator'
import fs from 'fs'
import morgan from 'koa-morgan'

const { logFolder } = global.config

// ensure log directory exists
fs.existsSync(logFolder) || fs.mkdirSync(logFolder)

// create a rotating write stream
const accessLogStream = FileStreamRotator.getStream({
  filename: logFolder + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD"
})

// setup the logger
const logger = morgan.middleware('combined', {stream: accessLogStream})
export default logger

