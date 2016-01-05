import { Router } from 'express'
import loginRouter from './login'
import dummyRouter from './dummy-data'
import aDataRouter from './authorized-data'
import refreshTokenRouter from './refresh-token'
import statusRouter from './status'

const apiRouter = new Router()
apiRouter.use('/login', loginRouter)
apiRouter.use('/dummy', dummyRouter)
apiRouter.use('/adata', aDataRouter)
apiRouter.use('/refreshtoken', refreshTokenRouter)
apiRouter.use('/status', statusRouter)
apiRouter.use((err, req, res, next) => {
		res.status(err.statusCode || 500).send(err.message || 'Something goes wrong')
})
apiRouter.all('*', (req, res) => {
	res.status(404).send('Not founnnnnnnnnnnnnnnd')
})




export default apiRouter
