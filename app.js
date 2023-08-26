const express= require('express');
const app = express();
const path = require('path');
const sequel = require('./util/database');
const router = require('./routers/usersignUp');
const bodyParser= require('body-parser');


app.use(express.static(path.join(__dirname, 'view')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',router);
sequel.sync().then(result => {
    app.listen(3000);
    
})
.catch(err => {
    console.log(err);
});
