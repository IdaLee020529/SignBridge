const express = require('express');
const UserController = require("../controllers/UserController");
const { uploadPicture } = require('../middlewares/multer.middleware');

const router = express.Router();

router.post('/users/signup', UserController.SignUpUser);
// router.post('/users/seed-preset', UserController.insertPresetAccounts);
router.get('/users', UserController.GetAllUsers);
router.post('/users/google/signup', UserController.SignUpGoogleUser);
router.post('/users/google/login', UserController.LoginGoogleUser);
router.get('/users/verify-email', UserController.VerifyEmail);
router.post('/users/login', UserController.LoginUser);
router.post('/users/forget-password', UserController.ForgetPassword);
router.post('/users/reset-password', UserController.ResetPassword);
router.post('/users/logout', UserController.LogoutUser);

// For profile page (Account)
router.get('/users/countries', UserController.GetAllCountries);
router.get('/users/:email/profile', UserController.GetUserByEmail);
router.put('/users/:userID/profile', uploadPicture, UserController.UpdateUserProfileById);

// For profile page (Sign text)
router.get('/users/all-datasets', UserController.GetAllDatasetCollection);
router.get('/users/:userID/datasets', UserController.GetUserDatasetCollection);


module.exports = router;