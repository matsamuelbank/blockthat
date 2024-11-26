const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const auth = require('../middleware/auth');


router.post('/login', userController.login);
router.post('/logout',auth, userController.logout);

module.exports = router;