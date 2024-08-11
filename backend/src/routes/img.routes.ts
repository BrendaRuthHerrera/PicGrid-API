import { Router } from 'express'
import { getLinks } from '../controllers/links.controller';
import validateToken from './validate-token';

const router = Router();

router.get('/', validateToken, getLinks);

export default router;