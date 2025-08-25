import { Router } from 'express'
import { categoryController } from '../controllers/categoryController'

const router = Router()

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getById)
router.post('/', categoryController.create)
router.put('/:id', categoryController.update)
router.delete('/:id', categoryController.delete)

export default router