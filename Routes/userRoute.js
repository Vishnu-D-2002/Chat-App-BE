const userController = require("../Controllers/userController");
const upload = require("../utils/multer");

const userRouter = require("express").Router();

userRouter.post("/", upload.single("image"), userController.signup);
userRouter.post("/login", userController.signin);
userRouter.get("/users/:userId", userController.allUsers);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.post("/new-password", userController.newPassword);
userRouter.post("/link/:email", userController.activationLink);
userRouter.get("/activate/:activationToken", userController.activateAccount);
userRouter.get("/one-user/:userId", userController.oneUser);
userRouter.put(
    "/users/:userId",
    upload.single("image")
    , userController.updateUser
);

module.exports = userRouter;
