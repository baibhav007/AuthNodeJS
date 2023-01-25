import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//Route level Middleware - to protect route
router.use('/changepassword', checkUserAuth)

// Public routes
router.post ('/register', userController.userRegistration)
router.post('/login', userController.userLogin)

//Protected routes
router.post('/changepassword', userController.changeUserPassword)

export default router