import express from 'express';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../../controllers/task/index.js";
import { getTasksLogs } from "../../controllers/activity/index.js";
const router = express.Router();
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/logs', getTasksLogs);
export default router;
//# sourceMappingURL=index.js.map