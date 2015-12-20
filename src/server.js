import path from 'path'
import express from 'express'
import config from '../tools/config'
import ReactDOM from 'react-dom/server'
import webpackIsomorhpicMiddleware from './server-middlewares/webpack-isomorphic-middleware'
import routerMiddleware from './server-middlewares/router-middleware'
import cookieParser from 'cookie-parser'

const app = new express()

app.use(cookieParser())

// assets
app.use('/static', express.static(path.join(__dirname, '..', 'build/public')))

// enhance webpack-isomorphic-middleware
app.use(webpackIsomorhpicMiddleware)

// router setting
app.use(routerMiddleware)


// app.get('/', (req, res) => {
// 	res.send('hello world')
// })

const server = app.listen(config.port, () => {
	const host = server.address().address
	const port = server.address().port
	console.log('Server listening at http://%s:%s', host, port)
})
