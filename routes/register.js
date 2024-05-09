//We need to pull express since its a route file
import express from 'express';
import registerController from '../controllers/registerController.js';

const router = express.Router();

router.post('/', registerController.handleNewUser);

export default router;

//Now put this on the server folder