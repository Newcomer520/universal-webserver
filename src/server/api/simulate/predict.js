import fetch from 'isomorphic-fetch'
import fs from 'fs'
import ProtoBuf from 'protobufjs'

const contract = fs.readFileSync('./src/common/protos/simulate.proto', 'utf8').toString()

const builder = ProtoBuf.loadProto(contract)

const Predict = builder.build('Predict')
const Actual = builder.build('Actual')

// console.log(Predict)




export const predict = () => {
	const data = {
		time: new Date().valueOf(),
		age: 18,
		uf: 23,
		conductivity: 23,
		dia_temp_value: 23,
		temperature: 33,
		dm: 23,
		gender: "male",
		d_weight_ratio: 1,
		bd_median: 1.0
	}
	var http = require('http')
	const buf = new Predict(data).encode().toArrayBuffer()

	const options = {
		headers: {
			'Content-Type': 'application/octet-stream',
			Accept: 'application/json'
			// Accept: 'application/octet-stream',
		},
		method: 'get',
		body: buf
	}

	fetch('http://210.200.13.224:10080/actual', options).then(res => {
		var chunks = []
		// console.log(res.status, res.body)
		if (res.status == 200) {
			// const buffer = new Buffer(res.body)
			res.body.on('data', chunk => {
        chunks.push(chunk)
        // bytes += chunk.length
      });

      res.body.on('end', () => {
      	const buffer = Buffer.concat(chunks)
      	console.log(Actual.decode(buffer))
      })
		}

			// console.log(res.body.arrayBuffer, res.body.json, res.body.blob, res.body.formData)
		// return res.json()
			// console.log(res.json())
			// console.log(Predict.decode(res))
	})
	// .then(json => console.log(json))
	.catch(err => {
		console.log(err)
	})
}


predict()
