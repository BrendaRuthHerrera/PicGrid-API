import { Router } from 'express';
import { addUser } from '../controllers/user.controller';
import { loginUser } from '../controllers/user.controller';

const router = Router();

router.post('/register', addUser)
router.post('/login', loginUser)

export default router;