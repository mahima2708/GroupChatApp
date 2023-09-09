const sequelize = require('sequelize');
const database = require('../util/database');
const signedUsers = database.define('Users',{
        id:{
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
            
        },
        name: {
           type:sequelize.STRING,
        },
        emailid:{
            type:sequelize.STRING,
            unique: true,
        },
        contactNo: sequelize.INTEGER,
        password: sequelize.STRING,
    });

    module.exports = signedUsers;