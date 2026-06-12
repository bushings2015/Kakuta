const authController = require('../controllers/authController');
const Router = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

authRouter.get('/user-info', authMiddleware, authController.userInfo);

authRouter.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = authRouter;
