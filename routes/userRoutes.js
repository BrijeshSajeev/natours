const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetpasssword', authController.forgetPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

// Protect all the routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.uplodePhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Restrict all the routes after this MW
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .delete(userController.deleteUser)
  .patch(userController.updateUser)
  .get(userController.getUser);

module.exports = router;
