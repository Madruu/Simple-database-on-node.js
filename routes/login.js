import express from 'express';
import authContoller from '../controllers/authContoller.js';

const router = express.Router();

router.post('/', authContoller.handleLogin);

export default router;
