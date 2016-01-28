import path from 'path'
import express from 'express'
import ReactDOM from 'react-dom/server'
import routerMiddleware from './middlewares/router-middleware'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import apiRouter from './api/index'
import logger from './middlewares/logger'
import helmet from 'helmet'

const app = new express()
app.use(helmet())
app.use(logger)
app.use(cookieParser())

// assets
app.use('/static', express.static(path.join(__dirname, '../..', 'build/public')))

// apis

// api documents
app.use('/apidoc/', express.static(path.join(__dirname, '../..', 'apidoc')))
app.use('/api', apiRouter)

// router setting
app.use('*', routerMiddleware)

const server = app.listen(global.config.port, () => {
	const host = server.address().address
	const port = server.address().port
	console.log('Server listening at http://%s:%s', host, port)
})
