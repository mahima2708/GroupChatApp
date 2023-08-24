const express= require('express');
const path = require('path');
const userTable = require('../models/signupDetails');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');

exports.postfile = (req,res,next)=>{
    const filepath = path.join(__dirname,'../view/signUp.html');
    res.sendFile(filepath);
}

exports.addUser = async (req,res,next)=>{
    console.log("@@@2" ,req.body);
    try{
    const name = req.body.name;
    const email = req.body.Email;
    const number = req.body.Number;

    const password = req.body.Password;
    const saltrounds = 5;
    bcrypt.hash(password, saltrounds, async(err, hash)=>{
        const data = await userTable.create({
            name:name,
            emailid:email,
            contactNo:number,
            password:hash,
            userId: req.user
        });
        res.status(200).json({newdata:data})
    })
}
catch(error){
    console.log(error)
}
}