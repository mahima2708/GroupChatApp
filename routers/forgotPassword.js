const express = require("express");
const route = express.Router();

const controller = require("../controllers/recoverPassword");
 
route.post('/forgotpassword', controller.sendmail)
route.get('/resetpassword/:id', controller.resetpassword)
route.post('/updatePassword', controller.updatePassword);

module.exports = route;