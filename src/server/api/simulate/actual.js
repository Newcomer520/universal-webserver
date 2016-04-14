import router from 'koa-router'
import fetch from 'isomorphic-fetch'
import { resolveBuffer } from 'common/protos'
import fetchProto from '../../utils/fetch-proto'

const apiUrl = 'http://210.200.13.224:10080/actual'
const actualRouter = new router()

actualRouter.get('/', function* (next) {
  try {
    const options = {
      method: 'get'
    }
    const result = yield fetchProto(apiUrl, options)
    this.body = result
  } catch (error) {
    this.throw(error, 500)
  }
})

export default actualRouter
