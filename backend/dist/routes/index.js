import express from 'express';
import authRoutes from './auth/index.js';
import workspaceRoutes from './workspace/index.js';
import projectRoutes from './projects/index.js';
import getTaskRoutes from './tasks/index.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/workspaces", authenticateToken, workspaceRoutes);
router.use("/projects", authenticateToken, projectRoutes);
router.use("/tasks", authenticateToken, getTaskRoutes);
export default router;
//# sourceMappingURL=index.js.map