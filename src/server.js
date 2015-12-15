import path from 'path' 
import express from 'express'
import config from '../tools/config'
import ReactDOM from 'react-dom/server'
import webpackIsomorhpicMiddleware from './server-middlewares/webpack-isomorphic-middleware'

const app = new express()
// assets
app.use(express.static(path.join(__dirname, '..', 'build/public')))

// router setting
app.use(webpackIsomorhpicMiddleware)
// app.get('/', (req, res) => {
// 	res.send('hello world')
// })

const server = app.listen(config.port, () => {
	const host = server.address().address
	const port = server.address().port
	console.log('Server listening at http://%s:%s', host, port)
})

