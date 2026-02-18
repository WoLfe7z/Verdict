import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getSettings, updateSettings } from '../controllers/settingsController'

const router = Router()

router.use(authenticate)

router.get('/', getSettings)
router.put('/', updateSettings)

export default router