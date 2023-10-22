const express= require('express');
const app = express();
const path = require('path');
const sequel = require('./util/database');
const router = require('./routers/usersignUp');
const bodyParser= require('body-parser');
const updatePass= require('./routers/forgotPassword');
const passwordTable = require('./models/passwordupdate');
const users = require('./models/signupDetails');
const groups = require('./models/groupTable');
const Usergroups = require('./models/userGroups');
const messages = require('./models/messgaetable');



app.use(express.static(path.join(__dirname, 'view')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',router);
app.use('/password', updatePass);

users.hasMany(passwordTable)
passwordTable.belongsTo(users)

users.hasMany(messages)
messages.belongsTo(users)

users.belongsToMany(groups,{through:Usergroups})
groups.belongsToMany(users,{through:Usergroups})

groups.hasMany( Usergroups, { foreignKey: 'groupTableId' });
Usergroups.belongsTo(groups, { foreignKey: 'groupTableId' });

users.hasMany( Usergroups, { foreignKey: 'UserId' });
Usergroups.belongsTo(users, { foreignKey: 'UserId' });

messages.belongsTo(groups, {foreignKey: 'groupId'})
groups.hasMany(messages, {foreignKey: 'groupId'})




sequel.sync().then(result => {
    app.listen(3000);
    
})
.catch(err => {
    console.log(err);
});
