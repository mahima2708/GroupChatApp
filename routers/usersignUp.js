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
router.post('/groupCreate',userAuthentication.authorisation,routeControl.create_Group);
router.get('/user',userAuthentication.authorisation, routeControl.getUsers);
router.get('/groupcreation', routeControl.sendPage)
router.get('/users', routeControl.sendUser)
router.post('/addUser',routeControl.add_user)
router.post('/addadmin', userAuthentication.authorisation,routeControl.add_admin )
router.get('/getgroups', userAuthentication.authorisation, routeControl.get_groups)
router.post('/getmembers', routeControl.groupDetails)
router.post('/makeadmin', routeControl.makeAdmin)
router.get('/groupmessages/:id', routeControl.groupMessages)
router.post('/updateUsers', routeControl.Update_Users)
router.get('/editUsers', routeControl.EditPage)
router.delete('/deletUser', routeControl.delete_User)
module.exports = router;