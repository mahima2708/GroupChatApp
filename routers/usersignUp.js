const express = require('express');
const router = express.Router();
const routeControl = require('../controllers/usersignup');

router.get('/', routeControl.postfile);
router.get('/signup.html',routeControl.postfile);
router.post('/signup', routeControl.addUser);

module.exports = router;