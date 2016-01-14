import path from 'path'
import express from 'express'
import ReactDOM from 'react-dom/server'
import webpackIsomorhpicMiddleware from './middlewares/webpack-isomorphic-middleware'
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
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// assets
app.use('/static', express.static(path.join(__dirname, '../..', 'build/public')))

// apis
app.use('/api', apiRouter)

// enhance webpack-isomorphic-middleware
app.use(webpackIsomorhpicMiddleware)

// router setting
app.use('*', routerMiddleware)

const server = app.listen(global.config.port, () => {
	const host = server.address().address
	const port = server.address().port
	console.log('Server listening at http://%s:%s', host, port)
})
