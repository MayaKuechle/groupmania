const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
var mysql = require ('mysql');
var expressValidator = require ('express-validator');
var expressSession = require ('express-session');
const session = require('express-session');
const app = express();
const path = require('path');
const db = require("./models");
//const Role = db.role;

var corsOptions = {
    origin: "http://localhost:3000/"
  };
  
app.use(cors(corsOptions));

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  //initialize();
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//app.use (resp.senfile.html)to get the files

app.use(bodyParser.json());
//app.use(expressValidator());
app.use(session({
    secret: 'max', 
    resave: false,
    saveUnitialized: true
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

var connection =mysql.createConnection({
    //properties
    host: 'db4free.net',
    user: 'groupmania2020',
    password: 'groupmania2020',
    database: 'groupmania'
});

connection.connect(function(error) {
//callback for when connected and there is error
    if(!!error) {
        console.log(error);
    } else {
        console.log('Connected');
    }
})

app.use(express.static(__dirname + '/public/'));
app.use('/images/', express.static(path.join(__dirname, 'images'))); 

app.get('/homepage',function(req,res){
    console.log(__dirname);
    res.sendFile(path.join(__dirname+'/public/homepage.html'));
    //__dirname : It will resolve to your project folder.
  });

app.get('/user', function(req, resp) {
    //about mysql
    connection.query("Select * FROM user", function(error, rows, fields){ //SQL query /select the table "all users eg"
        //callback
        if(!error) {
            console.log(rows); //data/rows in console.log to make sure data comes back make home page, start connecting routes
        } else {
            //parse with your rows/fields
            console.log("Successful query.");
        }
    })
})

app.get('/login', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname+'/public/login.html'));
})

app.get('/posts', function(req, resp) {
    connection.query("Select * FROM posts", function(error, rows, fields){ //SQL query /select the table "all users eg"
        //callback
        if(!error) {
            console.log(rows); //data/rows in console.log to make sure data comes back make home page, start connecting routes
            resp.status(200).json(rows);
        } else {
            //parse with your rows/fields
            console.log("Successful query.");
        }
    })
})

app.get('/comments', function(req, resp) {
    connection.query("Select * FROM comments", function(error, rows, fields){ //SQL query /select the table "all users eg"
        //callback
        if(!error) {
            console.log(rows); //data/rows in console.log to make sure data comes back make home page, start connecting routes
        } else {
            //parse with your rows/fields
            console.log("Successful query.");
        }
    })
})

app.get('/userpostsread', function(req, resp) {
    connection.query("Select * FROM userpostsread", function(error, rows, fields){ //SQL query /select the table "all users eg"
        //callback
        if(!error) {
            console.log(rows); //data/rows in console.log to make sure data comes back make home page, start connecting routes
        } else {
            //parse with your rows/fields
            console.log("Successful query.");
        }
    })
})
/*
app.get('/login', function(req, res) {
    if (req.session && req.session.authenticated) {
        var user= models.user.findOne({
            where: {
                username: req.session.username,
                password: req.session.password
            }
        }).then(function(user) {
            if (user) {
                req.session.username = req.body.username;
                req.session.user_id = user.dataValue.user_id;
                let username = req.session.username;
                let user_id = req.session.user_id;
                res.render('login', {
                    user: user
                });
            }
        })
    } else {
        res.redirect('/home')
    }
})*/

app.post('/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    models.user.findOne({
        where: {
            username: username,
            password: password
        }
    }).then(user => {
        if (user.password == password) {
            req.session.username = username;
            req.session.user_id = user.dataValue.user_id;
            req.session.authentication = true;
            console.log(req.session);

            res.redirect('/public/homepage.html');
        } else {
            res.redirect('/public/login.html');
            console.log("This is my session", req.session)
        }
    })
})

app.post('/signup', function(req, res) {
    const user = models.user.build({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    console.log (req.body);

    user.save().then(function(user){
        req.username = user.username;
        req.session.authenticated = true;
        res.redirect('/public/login.html')
        console.log(req.session);
    })
})

app.post('/posts', function(req, res) {
    const posts = models.posts.build({
        user_id: req.session.user_id,
        post_id: req.session.post_id,
        content: req.body.content,
    })

    posts.save().then(function(posts) {
        console.log(posts);
    })
})

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {})
    res.render('/public/login.html');
    console.log(req.session);
});


require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

module.exports = app;