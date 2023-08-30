const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/', userController.home);
router.post('/check-email', userController.checkEmail)
router.post('/check-scholarid', userController.checkScholarId)
router.post('/createUser', userController.createUser)
router.post('/send-otp', userController.sendOtp)
router.post('/verify-otp', userController.verifyOtp)
router.post('/auth', userController.auth)

module.exports = router;