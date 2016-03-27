import protobuf from 'protobufjs'
import simulate from 'common/protos/simulate.proto'

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
			transform: data => new ProtoRequest(data).toArrayBuffer()
		},
		response: {
			...getEnDn(ProtoResponse),
			transform: response => response.arrayBuffer().then(buffer => ProtoResponse.decode(buffer))
		}
	}
}

function getEnDn(Proto) {
	return {
		encode: data => new Proto(data),
		decode: buffer => Proto.decode(buffer)
	}
}

export default Protos

/**
 * 

 */