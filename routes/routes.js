import express from 'express';
const router = express.Router();
import loginController from '../controllers/login-controller.js';
import registerController from '../controllers/register-controller.js';
import postsController from '../controllers/posts-controllers.js';
import authMiddleware from '../middlewares/auth-middleware.js';

router.get('/', (req, res) => {
    const query = req.query.email;
    return res.send(`Hello API!, the query is ${query}`)
});

router.post('/login', loginController);
router.post('/register', registerController);
router.get('/posts', authMiddleware, postsController);

export default router;