import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { sendMessage, getChatHistory } from '../controllers/chatController'

const router = Router()

router.use(authenticate)

router.post('/:ideaId/messages', sendMessage)
router.get('/:ideaId/messages', getChatHistory)

export default router