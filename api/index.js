const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

const salt = bcrypt.genSaltSync(10);
const secret = 'nfdsajfnadjnksdksmfkmsdiofmdskvmds';

mongoose.connect(process.env.mongoose_link)

app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try {
        const userDoc = await User.create({username, password:bcrypt.hashSync(password,salt),
        });
        res.cookie('token', token).json('ok');
    } catch(e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOK = bcrypt.compareSync(password,userDoc.password);
    if(passOK) {
        jwt.sign({username, id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token',token).json('ok');
        });
    } else{
        res.status(400).json('wrong credentrials')
    }
})

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info)=>{
        if(err) throw err;
        res.json(info);
    });
    res.json(req.cookies);
})

app.post('/logout', (req,res) => {
    res.cookie('token','').json('ok');
})

app.listen(4000)