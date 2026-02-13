import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {createIdea, getIdeas, getIdea, updateIdea, deleteIdea, archiveIdea} from '../controllers/ideaController'
import { validateIdeaInput } from '../middleware/validate'

const router = Router()

router.use(authenticate)

router.post('/', validateIdeaInput, createIdea)
router.get('/', getIdeas)
router.get('/:id', getIdea)
router.put('/:id', validateIdeaInput, updateIdea)
router.delete('/:id', deleteIdea)
router.post('/:id/archive', archiveIdea)

export default router