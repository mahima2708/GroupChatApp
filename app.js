const express= require('express');
const app = express();
const path = require('path');
const sequel = require('./util/database');
const router = require('./routers/usersignUp');
const bodyParser= require('body-parser');
const updatePass= require('./routers/forgotPassword');
const passwordTable = require('./models/passwordupdate');
const users = require('./models/signupDetails');
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

sequel.sync().then(result => {
    app.listen(3000);
    
})
.catch(err => {
    console.log(err);
});
