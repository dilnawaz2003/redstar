import express from 'express';
import {createProject , getProjectById , getProjects} from '../../controllers/project/index.js'

const router = express.Router();

router.get('/',getProjects);
router.post('/',createProject);
router.get("/:id",getProjectById)


export default router;