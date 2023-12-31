const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'upload/' });
const fs = require('fs');
const Post = require('./models/Post');
const path = require('path');

require('dotenv').config();
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/upload', express.static(__dirname + '/upload'))

const salt = bcrypt.genSaltSync(10);
const secret = 'nfdsajfnadjnksdksmfkmsdiofmdskvmds';

mongoose.connect(process.env.mongoose_link)

app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try {
        const userDoc = await User.create({username, password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
        // res.cookie('token', token).json('ok');
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
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
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
});

app.post('/logout', (req,res) => {
    res.cookie('token','').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info)=>{
        if(err) throw err;
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        })
        res.json(postDoc);
    });
})

app.put('/post', uploadMiddleware.single('file'),async(req,res) => {
    let newPath = null;
    if(req.file) {
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info)=>{
        if(err) throw err;
        const {id,title,summary,content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        let tempPath = 'upload/' + postDoc.cover.replace('upload\\', '');
        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }
        // else{
        //     fs.unlinkSync(tempPath);
        // }
        // if (isAuthor) {
        //     tempPath = tempPath.replace('/','');
        //     // fs.unlinkSync(tempPath);
        //     // console.log(`File deleted ${tempPath}`);
        // }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover:newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });

})

app.get('/post', async (req,res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({credentials:-1})
            .limit(20)
    );

})

app.get('/post/:id', async(req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

app.listen(4000)