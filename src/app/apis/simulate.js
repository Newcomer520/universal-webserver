/**
 * demo 2-7, 模擬page相關的api
 */
import fetchObject, { fetch } from '../utils/fetch'
import Protos from 'common/protos'

const { SimulateActual: actualProto, SimulatePredict: predictProto } = Protos

export function apiActual() {
	return fetchObject('/api/simulate/actual', { 
		headers: {
			'Content-Type': 'application/octet-stream'
		},
		transform: actualProto.response.transform, 
		method: 'get' })
}

export function apiPredict() {
	const data = {
		age: 18,
		bd_median: 123,
		conductivity: 13.9,
		d_weight_ratio: 0.02299,
		dia_temp_value: 37,
		dm: 0,
		gender: 'F',
		// sbp: 136,
		temperature: 36.5,
		// time:"07:31:00",
		uf: 0.48,
	}
	
	const url = '/api/simulate/predict'
	const options = {
		headers: {
			'Content-Type': 'application/octet-stream'
		},
		method: 'post',
		body: predictProto.request.transform(data),
		transform: predictProto.response.transform
	}

	return fetchObject(url, options)
}