const sequelize = require('sequelize');
const db = require('../util/database');

const groups = db.define('groupTable',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    name:sequelize.STRING,
    admin: sequelize.STRING,

})

module.exports = groups;