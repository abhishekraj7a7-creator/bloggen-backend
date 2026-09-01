const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authController.registration)
router.post('/login', authController.login)
router.get('/identity', authMiddleware, authController.identity)
router.get('/logout', authController.logout)

module.exports = router;