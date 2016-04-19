import router from 'koa-router'
import fetch from 'isomorphic-fetch'
import getRawBody from 'raw-body'
import Protos, { resolveBuffer } from 'common/protos'
import fetchProto from '../../../utils/fetch-proto'

const apiUrl = 'http://210.200.13.224:10080/predict'
const predictRouter = new router()

predictRouter.post('/', function* (next) {
  try {
    const body = yield getRawBody(this.req)
    const options = { method: 'post', body }
    const result = yield fetchProto(apiUrl, options)
    this.body = result
  } catch (ex) {
    // console.error(ex)
    this.throw(ex)
  }
})

const fetchPredict = (body) => {
  const options = {
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    method: 'post',
    body
  }
}

export default predictRouter
