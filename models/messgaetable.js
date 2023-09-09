const sequelize = require('sequelize');
const db = require('../util/database')



const messages = db.define('userMessage', {
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    messages: sequelize.STRING,
} )

module.exports= messages;
