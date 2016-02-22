import { Router } from 'express'
import loginRouter from './login'
import logoutRouter from './logout'
import refreshTokenRouter from './refresh-token'
import statusRouter from './status'

const apiRouter = new Router()
apiRouter.use('/login', loginRouter)
apiRouter.use('/logout', logoutRouter)
apiRouter.use('/refreshtoken', refreshTokenRouter)
apiRouter.use('/status', statusRouter)
apiRouter.use((err, req, res, next) => {
	res.status(err.statusCode || 500).json(err.message || 'Something goes wrong')
})
apiRouter.all('*', (req, res) => {
	res.status(404).send('Not founnnnnnnnnnnnnnnd')
})




export default apiRouter
