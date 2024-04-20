const express = require('express');
const UserController = require("../controllers/UserController");

const router = express.Router();

router.post('/users/signup', UserController.SignUpUser);
router.post('/users/seed-preset', UserController.insertPresetAccounts);
router.get('/users', UserController.GetAllUsers);
router.post('/users/google/signup', UserController.SignUpGoogleUser);
router.get('/users/verify-email', UserController.VerifyEmail);
router.post('/users/login', UserController.LoginUser);
router.post('/users/forget-password', UserController.ForgetPassword);
router.post('/users/reset-password', UserController.ResetPassword);
router.post('/users/logout', UserController.LogoutUser);

module.exports = router;