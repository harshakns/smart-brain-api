//importing the required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const general = require('./controllers/general.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');
const register = require('./controllers/register.js');
const password = require('./controllers/password.js');
//importing the database
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'h4r5h4',
        password: '12!@',
        database: 'smart-brain'
    }
});

//creating the express instance called app.
const app = new express();

// for removing cross origin resource sharing errors (cors)
app.use(cors());

//bodyParser for parsing the data in the body
app.use(bodyParser.json());

//for handling the general users list
app.get('/',(req,res) => general.handleGeneral(req,res,db));

//for handling the signin route
app.post('/signin',(req,res)=>{signin.handleSignin(req,res,db,bcrypt)});

//for handling the register route
app.post('/register',(req,res)=>register.handleRegister(req,res,db,bcrypt));

//for handling the query related to profiles
app.get('/profile/:id',(req,res)=>profile.handleProfile(req,res,db));

//for handling the query related to image recognition usage
app.put('/image',(req,res)=>image.handleImage(req,res,db));

//for handling the image qurery and responding witht the face
//detection values

app.post('/imageUrl',(req,res)=>image.handleUrl(req,res));

//in case of forget password

app.post('/forgotpassword',(req,res)=>password.handlePassRecReq(req,res,db));

app.post('/resetPassword',(req,res)=>password.handleChangePass(req,res,db,bcrypt));

//initialising the app with the listen.
app.listen(3001, () => {
    console.log('i am listening on port 3001')
});