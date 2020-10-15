
const express = require('express');
var router = express.Router();
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
const { Router } = require('express');
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://hungdtgch190219:Hungbeo50@cluster0.yvnfp.gcp.mongodb.net/test';

app.get('/all',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    let results = await dbo.collection("ASM2").find({}).toArray();
    res.render('index',{products:results});
})

app.get('/delete',async function(req,res){
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    await dbo.collection("ASM2").deleteOne(condition);
    res.redirect('/all');
})

app.get('/insert',async function(req,res){
    res.render('insert');
})

app.post('/doInsert',async function (req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    let name = req.body.txtName;
    let price = req.body.txtPrice;
    let amount = req.body.txtAmount;
    let description = req.body.txtDescription;
    let newProduct = {name : name, price : price, description:description,amount:amount};
    await dbo.collection("ASM2").insertOne(newProduct);
    console.log(newProduct);
    
    res.redirect('/all');
});


var server = app.listen(process.env.PORT||5000,function(){
    console.log("Server is running on PORT 5000");
})