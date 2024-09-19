import express from 'express'
import {
  createTest,
  getUserTests,
  getTestByAccessLink,
  getTestDetails,
  getDendrogramData,
  getResultsAnalysis,
  editTestName,
  softDeleteTest
} from '../controllers/tests.js'

const router = express.Router()

// Create Routes
router.post('/create', createTest)
// Read Routes
router.get('/:userId', getUserTests)
router.get('/solve/:accessLink', getTestByAccessLink)
router.get('/details/:testId', getTestDetails)
router.get('/details/dendrogram/:testId', getDendrogramData)
router.get('/details/analysis/:testId', getResultsAnalysis)
// Update Routes
router.patch('/edit/:testId', editTestName)
router.patch('/:id/delete', softDeleteTest)
// Delete Routes

export default router
