import { Router } from 'express'
import loginRouter from './login'

const apiRouter = new Router()
apiRouter.use('/login', loginRouter)
apiRouter.all('*', (req, res) => {
	res.status(404).send('Not founnnnnnnnnnnnnnnd')
})




export default apiRouter
