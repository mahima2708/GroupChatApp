const sequelize = require('sequelize');
const database = require('../util/database');
const signedUsers = database.define('Users',{
        id:{
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: sequelize.STRING,
        emailid:{
            type:sequelize.STRING,
            unique: true,
        },
        contactNo: sequelize.INTEGER,
        password: sequelize.STRING,
        ispremiumuser: {
            type: sequelize.BOOLEAN,
            defaultValue : 0,
        },
        total_expense: {
            type: sequelize.INTEGER,
            defaultValue : 0,
        }
    });

    module.exports = signedUsers;