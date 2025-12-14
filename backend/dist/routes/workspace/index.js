import express from 'express';
import { getUserWorkspaces, createWorkspace, getWorkspaceById } from "../../controllers/workspace/index.js";
const router = express.Router();
router.get('/', getUserWorkspaces);
router.post('/', createWorkspace);
router.get("/:id", getWorkspaceById);
export default router;
//# sourceMappingURL=index.js.map