import express from 'express';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../../controllers/task/index.js";
const router = express.Router();
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
export default router;
//# sourceMappingURL=index.js.map