import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

//Route level Middleware - to protect route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

// Public routes
router.post ('/register', userController.userRegistration)
router.post('/login', userController.userLogin)

//Protected routes
router.post('/changepassword', userController.changeUserPassword)
router.get('/loggeduser', userController.loggeduser)

export default router