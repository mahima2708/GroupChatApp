const Sequelize = require('sequelize');
const db = require('../util/database')



const forgotpassword = db.define('forgotpassword', {
id:{
    type:Sequelize.UUID,
    primaryKey: true
},
isActive: Sequelize.BOOLEAN

} )

module.exports= forgotpassword;
