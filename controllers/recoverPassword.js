const sib = require('sib-api-v3-sdk');
require('dotenv').config()
const uuid = require('uuid');
const User = require('../models/signupDetails');
const password = require('../models/passwordupdate');
const { UUIDV4 } = require('sequelize');
const path = require('path');
const bcrypt = require('bcrypt');

const client = sib.ApiClient.instance

const apiKey = client.authentications['api-key']
const transEmailApi = new sib.TransactionalEmailsApi()

exports.sendmail = async (req,res,next)=>{
    try{
        const email = req.body.email;
        console.log("&&&",email);
        const user = await User.findOne({where : {emailid:email }});
        if(user){
            
            const id = uuid.v4();
            console.log("the id for the client is", id);
           
            user.createForgotpassword({id: id, isActive: true})
            .catch(err=>{

                console.log("%%%%%", err);
                throw new Error(err)
            })
           

            apiKey.apiKey = process.env.API_KEY

            const sender = {
                email: 'mhtamta5@gmail.com'
            }
            const recievers = [
                {
                    email: req.body.email
                }
            ]
            transEmailApi
            .sendTransacEmail({
                sender,
                to: recievers,
                subject: 'Reset Password',
                textContent: 'Reset your password via the link provided below',
                htmlContent: `<a href ="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`

            }).then(response=>{
                return res.status(202).json({message: 'Link to reset password send', success: true})

            })
            .catch(err=>{
                throw new Error(err);
            })
        }
        else{
            throw new Error('User does not exist')
        }
    }
    catch(err){
        console.log("@@@", err);
        return res.json({message:err, success: false})
    }

}

exports.resetpassword = async (req,res,next)=>{
    const id = req.params.id;
    password.findOne({where: {id:id}}).then(passwordrequests=>{
           if(passwordrequests){
            passwordrequests.update({ isActive: false});
            const resetFile = path.join(__dirname,'../view/passwordlink.html');
            res.status(200).sendFile(resetFile);


            //res.end()
           }


    })
    
}

exports.updatePassword = async (req,res,next)=>{
    console.log("$%$%%$%$%", req.body);
    const id = req.body.id;
   const user = await password.findOne({where: {id:id}, attributes: ['UserId']})
    console.log("%#%%#%#%#355",user.UserId);
    const updatedPassword = req.body.newpassword;
    console.log("new password is", updatedPassword);
    if(user){
    const saltrounds = 10;
    bcrypt.hash(updatedPassword, saltrounds , async(err,hash)=>{
        if(err){
            console.log(err);
        }
        else{
       await User.update({password:hash}, { where:
         
        {'id':user.UserId}}
         );
       res.status(200).json({message: 'password got updated'});
        }

    })
}
else {
    res.status(404).json({message:'UserNot Found'})
}


}
