const express= require('express');
const path = require('path');
const userTable = require('../models/signupDetails');
const msgTable = require('../models/messgaetable');
const sequelize = require('sequelize');
const token= require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.postfile = (req,res,next)=>{
    const filepath = path.join(__dirname,'../view/signUp.html');
    res.sendFile(filepath);
}
exports.loginsend= (req,res,next)=>{
    const filepath = path.join(__dirname, '../view/login.html');
    res.sendFile(filepath);
}


function generateToken(id,name){
    return token.sign({userId:id,name:name}, '45$545778%576565');
  }


exports.addUser = async (req,res,next)=>{
    //console.log("@@@2" ,req.body);
    try{
        
    const name = req.body.name;
    const email = req.body.Email;
    const number = req.body.Number;

    const password = req.body.Password;
    const saltrounds = 5;
    bcrypt.hash(password, saltrounds, async(err, hash)=>{
        try{
        const data = await userTable.create({
            name:name,
            emailid:email,
            contactNo:number,
            password:hash,
            userId: req.user
        });
        res.status(200).json({newdata:data})
    }
    catch(error){
        res.status(201).json({duplicate: "duplicateentry"})
    }
    })
}
catch(error){
    console.log("@@@@@@error");
    console.log(error)
}
}

exports.loginUser = async ( req,res,next)=>{
    try{
    email = req.body.email;
    password = req.body.password;
    const user = await userTable.findOne({
        where: {
            emailid: email
        }
    });
    if(!user){
        res.status(404).json({success:false,  message: "User Not Found"})
    }
    else{
        const record = await userTable.findOne({
            where: {
                emailid: email,
                password: password
            }
        });
        bcrypt.compare( password, user.password, (err, result)=>{
            if(result === true){
                res.status(200).json({success: true , message: "User logged in successfully", token: generateToken(user.id, user.name)});
            }
            else{
                res.status(401).json({success: false, message: "Password incorrect"})
            }
        })
    }
}
     catch (error) {
    console.error('Error retrieving entry:', error);
  }
}

exports.storemessages = async (req,res,next)=>{
    const message = req.body.message;
    try{
        const data = await msgTable.create({
            message,
            UserId: req.user.id,
            name:req.user.name,
        });
        res.status(200).json({message: data , success: true})


    }
    catch(error){
    console.log(error);
    }
}

exports.getMessages = async (req,res,next)=>{
    const msg = await msgTable.findAll().then((response)=>{
        const msgArray = [];
        response.forEach((item)=>{

            msgArray.push({
                message:item.message,
                name:item.name
            
            })
        })
        res.status(201).json({newdata: msgArray});
    }).catch((err)=>{
        res.status(404).json({err:err});
    })

    
}