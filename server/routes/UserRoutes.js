const express = require('express');
const UserController = require("../controllers/UserController");

const router = express.Router();

// router.post('/users', UserController.SignUpUser);
router.post('/users/seed-preset', UserController.insertPresetAccounts);
router.get('/users', UserController.GetAllUsers);

module.exports = router;