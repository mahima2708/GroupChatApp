const jwt = require('jsonwebtoken');
const User = require('../models/signupDetails');
const authorisation = (req,res,next)=>{
    try{
        const token = req.header('Authorisation');
        const user = jwt.verify(token, '45$545778%576565')
       console.log("^^^^^^", user , "@@@@@@");
       User.findByPk(user.userId).then(user=>{
        req.user = user;
        next();
       }).catch((err)=> {throw new Error(err)})
    }catch(err){
        console.log(err);
        return res.status(401).json({success: false})
       }
    }

   module.exports= {
    authorisation
};


