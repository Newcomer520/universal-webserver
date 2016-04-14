import protobuf from 'protobufjs'
import simulate from 'common/protos/simulate.proto'
import { canUseDOM } from 'app/utils/fetch'

const Protos = {
	SimulateActual: protoObject(simulate, 'Actual'),
	SimulatePredict: protoObject(simulate, 'PredictRequest', 'PredictResponse')
}

function protoObject(protoContent, requestMessage, responseMessage = requestMessage) {
	const ProtoRequest = protobuf.loadProto(protoContent).build(requestMessage)
	const ProtoResponse = protobuf.loadProto(protoContent).build(responseMessage)

	return {
		request: {
			...getEnDn(ProtoRequest),
			transform: data => {
        if (canUseDOM) {
          return new ProtoRequest(data).toArrayBuffer()
        } else if (!__CLIENT__) {
          const stream = require('stream')
          const buffer = new ProtoRequest(data).toBuffer()
          const bufferStream = new stream.PassThrough()
          bufferStream.end(buffer)
          return bufferStream
        }

      }
		},
		response: {
			...getEnDn(ProtoResponse),
			transform: response => {
				if (canUseDOM) {
					return response.arrayBuffer().then(buffer => ProtoResponse.decode(buffer))
				}
				else {
					return resolveBuffer(response.body).then(buffer => ProtoResponse.decode(buffer))
				}
			}
		}
	}
}

function getEnDn(Proto) {
	return {
		encode: data => new Proto(data),
		decode: buffer => Proto.decode(buffer)
	}
}

const resolveBuffer = body => new Promise((resolve, reject) => {
	const chunks = []
	body.on('data', chunk => {
		chunks.push(chunk)
	});

	body.on('end', () => {
		const buffer = Buffer.concat(chunks)
		resolve(buffer)
	})
	body.on('error', (e) => {
		reject(e)
	})
})

export default Protos

/**
 *

 */
