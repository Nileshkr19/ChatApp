
import { Router } from 'express'
import userRoutes from './src/routes/user.routes.js'
import tokensRoutes from './src/routes/tokens.routes.js'


const router = Router()

router.use('/api/v1/users', userRoutes)
router.use('/api/v1/tokens', tokensRoutes)


export default router;