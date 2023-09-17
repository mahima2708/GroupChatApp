const express = require('express');
const router = express.Router();
const routeControl = require('../controllers/usersignup');
const userAuthentication = require('../middleware/auth');

router.get('/', routeControl.postfile);
router.get('/signup.html',routeControl.postfile);
router.get('/login.html', routeControl.loginsend);
router.post('/signup', routeControl.addUser);
router.post('/login', routeControl.loginUser);
router.post('/messages', userAuthentication.authorisation,  routeControl.storemessages);
router.get('/message/:id', routeControl.getMessages );

module.exports = router;