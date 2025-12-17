import express from 'express';
import { login, register, getCurrentUser, checkUserExist } from '../../controllers/auth/index.js';
import { authenticateToken } from '../../middlewares/authenticateToken.js';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/userexist", checkUserExist);
export default router;
//# sourceMappingURL=index.js.map