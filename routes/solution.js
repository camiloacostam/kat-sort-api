// routes/solutionRoutes.js
import express from 'express'
import {
  startTest,
  saveAnswers,
  completeTest,
  addCommentToSort
} from '../controllers/solution.js'

const router = express.Router()

router.post('/start', startTest)
router.put('/answer', saveAnswers)
router.put('/complete', completeTest)
router.put('/comment', addCommentToSort)

export default router
