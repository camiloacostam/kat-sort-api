import express from 'express'
import {
  createTest,
  getUserTests,
  getTestByAccessLink,
  getTestDetails,
  getDendrogramData,
  getResultsAnalysis
} from '../controllers/tests.js'

const router = express.Router()

router.post('/create', createTest)
router.get('/:userId', getUserTests)
router.get('/solve/:accessLink', getTestByAccessLink)
router.get('/details/:testId', getTestDetails)
router.get('/details/dendrogram/:testId', getDendrogramData)
router.get('/details/analysis/:testId', getResultsAnalysis)

export default router
