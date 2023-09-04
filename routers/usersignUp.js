const express = require('express');
const router = express.Router();
const routeControl = require('../controllers/usersignup');

router.get('/', routeControl.postfile);
router.get('/signup.html',routeControl.postfile);
router.get('/login.html', routeControl.loginsend);
router.post('/signup', routeControl.addUser);
router.post('/login', routeControl.loginUser);

module.exports = router;