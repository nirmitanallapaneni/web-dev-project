'use strict';
const express= require('express');
const app=express()
const nodemailer = require('nodemailer');
var bodyParser =require('body-parser');
const { stringify } = require('querystring');
const fs=require('fs');

const rawdata = fs.readFileSync('data.json');
const data=JSON.parse(rawdata);
const port=process.env.PORT || 8000;


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));


const saveData= function(data,file){
    const finished=(error)=>{
        if (error){
            console.error(error);
            return;
        }
    }

    const jsonData=JSON.stringify(data,null,2);
    fs.writeFile(file,jsonData,finished);
   
}


const lib = require("./server");


const saveUser = function(body){
 
    const newUser ={
        name:body.name,
        phone:body.phone,
        email:body.email,
        comment:body.comments
    }
data[body.name]=newUser;
saveData(data,'data.json');
}


app.post('/send',function(req,res) {
    console.log("saving user");
    saveUser(req.body);
    lib.smail(req.body.email,req.body.name);
    res.redirect('/'); 
 
})



app.get('/',function(req,res){
    res.sendFile(__dirname + '/views/index.html');
})


app.get('/table',function(req,res){
    res.sendFile(__dirname + '/views/table.html');
})


app.get('/av',function(req,res){
    res.sendFile(__dirname + '/views/av.html');
})

app.get('/game',function(req,res){
    res.sendFile(__dirname + '/views/game.html');
})
app.get('/chicago',function(req,res){
    res.sendFile(__dirname + '/views/chicago.html');
})
app.get('/feedback',function(req,res){
    res.sendFile(__dirname + '/views/feedback.html');
})
app.get('/miami',function(req,res){
    res.sendFile(__dirname + '/views/miami.html');
})




app.listen(port,()=>{
    console.log("server running on port " + port);
})