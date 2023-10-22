const sequelize = require('sequelize');
const db = require('../util/database');

const users_group =  db.define('usersGroup',{

isAdmin: sequelize.BOOLEAN

});

module.exports = users_group;
