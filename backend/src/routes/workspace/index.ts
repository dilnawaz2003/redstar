import express from 'express'

import {getUserWorkspaces,createWorkspace,getWorkspaceById,getWorkspaceMembers,sendInvitation, acceptInvitation} from "../../controllers/workspace/index.js";



const router = express.Router();

router.get('/',getUserWorkspaces);
router.post('/',createWorkspace);
router.post('/invite',sendInvitation);
router.post('/accept',acceptInvitation);
router.get("/:id",getWorkspaceById)
router.get("/:id/members",getWorkspaceMembers)

export default router;