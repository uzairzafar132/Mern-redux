const express = require('express');
const router =express.Router();
const userController = require('../controller/userController')
const protect =require('../middleware/authMiddleware')

router.post('/login',userController.loginUser)
router.post('/register',userController.registerUser)
router.post('/logout',userController.logoutUser)
router.route('/profile').get(protect,userController.getUserProfile).put(protect,userController.updateUserProfile)


module.exports = router;