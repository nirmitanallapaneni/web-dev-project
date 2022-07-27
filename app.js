'use strict';
const express = require('express');
const app = express()
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
const { stringify } = require('querystring');
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://nirmitan:1234@cluster0.iwrwf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var conn = MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    const collections = await dbo.listCollections().toArray();
    for (let i = 0; i < collections.length; i++) {
        if (collections[i].name == 'feedbacks') {
            return;
        }
    }
    //   if(collections)
    dbo.createCollection("feedbacks", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
});

const rawdata = fs.readFileSync('data.json');
const data = JSON.parse(rawdata);
const port = process.env.PORT || 8000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));


const saveData = function (data, file) {
    const finished = (error) => {
        if (error) {
            console.error(error);
            return;
        }
    }

    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFile(file, jsonData, finished);

}


const lib = require("./server");


const saveUser = function (body) {

    const newUser = {
        name: body.name,
        phone: body.phone,
        email: body.email,
        comment: body.comments
    }
    data[body.name] = newUser;
    saveData(data, 'data.json');
}


app.post('/send', async function (req, res) {
    console.log("saving user");
    let count = 0;
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        let collection = dbo.collection("feedbacks");
        await collection.insertOne(req.body,async function (err, res) {
            if (err) throw err;
            console.log("document inserted");

            count = await collection.countDocuments({});
            db.close();
            lib.smail(req.body.email, req.body.name,count);
            
        });
    });

    // saveUser(req.body);
    
    res.redirect('/');

})



app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
})


app.get('/table', function (req, res) {
    res.sendFile(__dirname + '/views/table.html');
})


app.get('/av', function (req, res) {
    res.sendFile(__dirname + '/views/av.html');
})

app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/views/game.html');
})
app.get('/chicago', function (req, res) {
    res.sendFile(__dirname + '/views/chicago.html');
})
app.get('/feedback', function (req, res) {
    res.sendFile(__dirname + '/views/feedback.html');
})
app.get('/miami', function (req, res) {
    res.sendFile(__dirname + '/views/miami.html');
})




app.listen(port, () => {
    console.log("server running on port " + port);
})