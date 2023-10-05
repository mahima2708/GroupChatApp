const express= require('express');
const path = require('path');
const userTable = require('../models/signupDetails');
const msgTable = require('../models/messgaetable');
const userGroup = require('../models/userGroups');
const groups = require('../models/groupTable');
const sequelize = require('sequelize');
const token= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op }= require('sequelize');


exports.postfile = (req,res,next)=>{
    const filepath = path.join(__dirname,'../view/signUp.html');
    res.sendFile(filepath);
}
exports.loginsend= (req,res,next)=>{
    const filepath = path.join(__dirname, '../view/login.html');
    res.sendFile(filepath);
}

exports.sendPage =(req,res,next)=>{
    const filepath = path.join(__dirname, '../view/groupcreation.html');
    res.sendFile(filepath);
}
exports.sendUser = (req,res,next)=>{
    const filepath = path.join(__dirname, '../view/users.html');
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
    const id = req.params.id;
    console.log("id is %%%", id)
    const msg = await msgTable.findAll({
        where: {
            id:{
                [Op.gt]:id
            }
        }
    }).then((response)=>{
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

exports.create_Group = async (req,res,next)=>{
    const groupname = req.body.name;
    const userId = req.user.id;
    console.log("hellooooo", req.body)
    try{
     const Group = await groups.create({
        name:groupname,
        admin:req.user.name
     });
     
     const group = await groups.findOne({
        where:{
            name:groupname,
        }
     })

     res.status(200).json({message:group,  success:true})
     
    }
    catch(err){
        console.log("@@@ Error is", err);
        res.status(400).json({messgae:"something went wrong", success:false});
        
    }

}

exports.getUsers = async (req,res,next)=>{
    const excludeUser = req.user.id
    try{
    const Users = await userTable.findAll({
        where: {
            id: {
              [Op.not]:  excludeUser
            }
          }
    }).then((response)=>{
        const userArray = [];
        response.forEach((item)=>{

            userArray.push({
                id:item.id,
                name:item.name
            
            })
        })
        res.status(200).json({newdata: userArray});
    }).catch((err)=>{
        res.status(404).json({err:err});
    })
    }
    catch(err){
        res.status(408).json({err:err});
    }
}

exports.add_user = async (req,res,next)=>{
    const UserId = req.body.UserId;
    const groupTableId = req.body.groupTableId
    try{
        console.log("format", req.body);
        const detail= userGroup.create({
            UserId,
            groupTableId
        }) 
        res.status(200).json({message:detail, success:true})
    }
    catch(err){
        throw new Error(err);
    }
   
}

exports.add_admin  = async (req,res,next)=>{
    const groupTableId = req.body.id
    try{
        console.log("format", req.body);
        const detail= userGroup.create({
            UserId: req.user.id,
            groupTableId
        }) 
        res.status(200).json({message:detail, success:true})
    }
    catch(err){
        throw new Error(err);
    }
   
}

exports.get_groups = async (req,res,next)=>{
    try{
        var groupArray = [];
    const id= req.user.id;
   const groupEntry = await groups.findAll({
    attributes: ['name', 'id'],
    include: {
      model: userGroup,
      where: { UserId: id },
      attributes: [], // Exclude all columns from Usersgroups table
    },
  }).then((response)=>{
    console.log("here is group response ###", response)
    response.forEach((items)=>{
        groupArray.push({

        name:items.name,
        idValue: items.id
    })
    })
    console.log("the array is", groupArray);
  }).catch((err)=>{
    console.log(err);
  })
     res.status(200).json({message: groupArray, success:true})
    }
    catch(err){
        res.status(400).json({message:err, success:false});
     console.log(err);
    }


}