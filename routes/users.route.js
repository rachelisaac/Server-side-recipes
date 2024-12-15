import express from 'express';
import { getAllUsers, login, register } from '../controllers/user.controller.js';
import { generateToken } from '../middlwares/generateToken.middleware.js';
import { auth, adminAuth } from '../middlwares/auth.middlwares.js';

const router = express.Router();

// Get all users - restricted to admins only
router.get('/', auth, adminAuth, getAllUsers);

// Login route
router.post('/login', generateToken, login);

// Register route
router.post('/register', register);

export default router;

