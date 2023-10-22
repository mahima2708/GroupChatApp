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

exports.EditPage = (req,res,next)=>{
    const filepath = path.join(__dirname, '../view/editUsers.html');
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
        console.log(error);
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
    const id= req.body.id;
    try{
        const data = await msgTable.create({
            message,
            UserId: req.user.id,
            name:req.user.name,
            groupId:id,
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
    console.log("here is your user", req.body.details.isAdmin)
    const UserId = req.body.details.UserId;
   
    const groupTableId = req.body.groupTableId
    const admin = req.body.details.isAdmin
    try{
        console.log("format", req.body);
        const detail= userGroup.create({
            isAdmin: admin,
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
    const admin = req.body.isAdmin;
    console.log("is it null", admin)
    try{
        console.log("format", req.body);
        const detail= userGroup.create({
            UserId: req.user.id,
            groupTableId,
            isAdmin: admin
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

exports.groupDetails = async (req,res,next)=>{
    try{
        console.log("helloooo ladiessss");
        var memberArray = [];
    console.log("request", req.body);
     const id = req.body.groupid;
     console.log('id is', id)
     const memebrs = await userTable.findAll({
        attributes: ['name'],
        include: {
          model: userGroup,
          where: { groupTableId: id },
        },
      }).then((response)=>{
        response.forEach((items)=>{
            memberArray.push({
                name: items.name
            })
        })
        console.log("the members are $$$", memberArray);
      }).catch((err)=>{
        console.log(err);
      })
      res.status(200).json({message: memberArray, success: true});

    }
    catch(err){
        console.log("the error is", err);
    }

}

exports.groupMessages = async (req,res,next)=>{
    const Id = req.params.id;
    console.log("the group id is", Id)
    const groupmsgArray= [];
    await msgTable.findAll({
        where: {
            groupId: Id
        }
    }).then((response)=>{
        response.forEach((items)=>{
            groupmsgArray.push({
                name: items.name,
                message: items.message
            })
        });
         res.status(200).json({ message: groupmsgArray, success: true});
    }).catch((err)=>{
        console.log(err);
    }) 



}

exports.makeAdmin = async (req,res,next)=>{
    try{
    console.log("heres your request body", req.body)
  await userGroup.update(
    { isAdmin: 1 },
    {
      where: {
        UserId: req.body.id,
        groupTableId: req.body.groupId
      }
    }
  )
  res.status(200).json({message:"updated successfully", success: true })
}
catch(err){
    res.status(202).json({message: err, success: false})
}
}

exports.Update_Users = async (req, res, next)=>{
    try{
        console.log("the req body", req.body);
 const id  = req.body.id;
 console.log("the group id ", id)
    const memebrs = await userTable.findAll({
        attributes: ['name', 'id'],
        include: {
          model: userGroup,
        // attributes: ['isAdmin'],
          where: { groupTableId: id },
        },
      })
   console.log("is it coming @@@", memebrs);
const UpdatArray=[]
for (const user of memebrs) {
    var name = "";
    var idVal = "";
    var adminstat=""
    //console.log(user.dataValues.usersGroups)
    for (const kk of user.dataValues.usersGroups){
         name = user.dataValues.name
        adminstat =kk.dataValues.isAdmin
        idVal= user.dataValues.id
      
          } 
     const jsonMessage={
        Userid: idVal,
        nameval:name,
        adminval:adminstat
    }
    UpdatArray.push(jsonMessage)
    
  }
  const excludedUserIds = memebrs.map(user => user.id);

// Construct a query to fetch all users excluding the ones in excludedUserIds
const allUsers = await userTable.findAll({
  attributes: ['name', 'id'],
  where: {
    id: {
      [Op.notIn]: excludedUserIds,
    },
  },
});

// Transform the result into the desired format
const updatedArray = allUsers.map(user => ({
    Userid: user.id,
    nameval: user.name,
    adminval: null,

  
  // Assuming you want adminval to be null for these users
}));

// const updatedArrayJSON = JSON.stringify(updatedArray);

UpdatArray.push(...updatedArray);


  console.log("##########################",UpdatArray);
     
      res.status(200).json({message: UpdatArray, success: true});
    }
    catch(err){
        console.log(err);
    }

}

exports.delete_User = async (req,res,next)=>{
console.log("req.body", req.query.param1);
try{
const userdeleted = await userGroup.destroy({
    where: {
        UserId: req.query.param1,
        groupTableId: req.query.param2,
    }
})
res.status(200).json({ message: "User removed from group successfully", success: true})
}
catch(err){
    res.status(202).json({message:"couldn't proceed to your request", success: false})
    console.log(err);
}


}