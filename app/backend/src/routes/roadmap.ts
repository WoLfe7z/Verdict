import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { getRoadmap, updateStep, completeStep } from '../controllers/roadmapController'

const router = Router()

router.use(authenticate)

router.get('/:ideaId', getRoadmap)
router.put('/:ideaId/steps/:stepId', updateStep)
router.post('/:ideaId/steps/:stepId/complete', completeStep)

export default router