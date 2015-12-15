// port path from 'path'
// import express from 'express'
// import config from '../tools/config'
const path = require('path')
const express = require('express')
const config = require('../tools/config')

const app = new express()
// assets
// app.use(express.static(path.join(__dirname, '..', 'public')))

// router setting
app.get('/', function(req, res) {
	res.send('hello world 23fds213')
})

const server = app.listen(config.port, function() {
	const host = server.address().address
	const port = server.address().port
	console.log('Server listening at http://%s:%s', host, port)
})

