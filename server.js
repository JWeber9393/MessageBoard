// Imports/Required Statements
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const flash = require('express-flash');

// Package Config
const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// app.use('/', express, static(__dirname + '/stylesheets'))
app.use(express.urlencoded({ extended: true })); //for post requests
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash());

mongoose.connect('mongodb://localhost/MongooseDashboard', {useNewUrlParser: true});

const MongooseSchema = new mongoose.Schema({
    name: {type: String},
    age: {type: Number},
    gender: {type: String}
})
const mongooses = mongoose.model('Mongoose', MongooseSchema);


// Controllers (Routes)
app.get('/', (req, res) => {
    console.log("****************************************")
    console.log("In the root route controller")
    console.log("****************************************")
    mongooses.find({})
        .then(data => {
            res.render("index", {allMongooses: data})
        })
        .catch(err => res.json(err))
})

app.get('/mongooses/view/:id', (req, res) => {
    const {id} = req.params;
    console.log("****************************************")
    console.log("In the info route controller")
    console.log("The user id requested is: ", id);
    console.log("****************************************")
    mongooses.findOne({_id: id})
    .then(data => {
        res.render("mongooseinfo", {mongooseData: data})
        console.log(data)
    })
    .catch(err => res.json(err))
})

app.get('/mongooses/new', (req, res) => {
    console.log("****************************************")
    console.log("In the create form route controller")
    console.log("****************************************")
    res.render("newmongoose");
})

app.post('/processnewmongoose', (req, res) => {
    console.log("****************************************")
    console.log("In the post route controller")
    console.log("****************************************")
    const mongooseData = req.body;
    mongooses.create(mongooseData)
    .then(newMongoose => {
        newMongoose.save()
        console.log(req.body)
        res.redirect("/");
        })
    .catch(err => {
        console.log(err);
    })
})

app.get('/mongooses/edit/:id', (req, res) => {
    console.log("****************************************")
    console.log("In the edit route controller")
    console.log("****************************************")
    id = req.params.id;
    console.log(req.params)
    mongooses.findById(id)
        .then(data => {
            console.log(data)
            res.render("editmongoose", { mongoose: data })
        })
        .catch(err => res.json(err));
})

app.post('/mongooses/process_update/:id', (req, res) => {
    const {id} = req.params;
    console.log("****************************************")
    console.log("In the update post route controller")
    console.log(req.params.id)
    console.log("****************************************")
    mongooses.findOne({_id: id})
    .then(mongoose => {
            mongoose.name = req.body.name;
            mongoose.age = req.body.age;
            mongoose.gender = req.body.gender;
            mongoose.save();
            res.redirect('/')
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/mongooses/destroy/:id', (req, res) => {
    const { id } = req.params;
    console.log("****************************************")
    console.log("In the destroy route controller")
    console.log("The user id requested is: ", id);
    console.log("****************************************")
    mongooses.findOneAndRemove({_id: id})
        .then(deletedMongoose => {
            deletedMongoose.save()
        })
        .catch(err => {
            console.log(err);
        })
    res.redirect("/");
})

// Listen
app.listen(8000, () => console.log("listening on port 8000"));


//