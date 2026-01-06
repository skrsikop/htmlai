import express from 'express'
import { deleteProject, getProjectById, getProjectPreview, getPublishedProjects, makeRevision, rollBackToVersion, saveProjectCode } from '../controllers/projectController.js'
import { protect } from '../middleware/auth.js'

const projectRouter = express.Router()

projectRouter.post('/revision/:projectId', protect, makeRevision)
projectRouter.put('/save/:projectId', protect, saveProjectCode)
projectRouter.post('/rollback/:projectId/:versionId', protect, rollBackToVersion)
projectRouter.delete('/:projectId', protect, deleteProject)
projectRouter.get('/preview/:projectId', protect, getProjectPreview)
projectRouter.get('/published', getPublishedProjects)
projectRouter.get('/published/:projectId', protect, getProjectById)

export default projectRouter