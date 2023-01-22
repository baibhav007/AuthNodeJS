import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";

// Public routes
router.post ('/register', userController.userRegistration)


//Protected routes


export default router