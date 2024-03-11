const userController = require('../Controllers/userController');

const userRouter = require('express').Router();

userRouter.post("/", userController.signup);
userRouter.post('/login',userController.signin)

module.exports = userRouter;