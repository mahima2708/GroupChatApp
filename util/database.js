const sequelize = require('sequelize');
const database = new sequelize('chatapps','root','root',{
     host: 'localhost',
     dialect: 'mysql'
});

module.exports = database;