const sequelize = require('sequelize');
const dotenv = require('dotenv')
dotenv.config();
const database = new sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
     host: process.env.DB_HOST,
     dialect: 'mysql'
});

module.exports = database;