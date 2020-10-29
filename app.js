const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser =require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open',function(){
    console.log("connected to Mongodb");
})
// check for db error
db.on('error',function(err){
    console.log(err);
})
// init app

const app = express();

// models
let Movie = require('./models/movies')

// load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
// parse application
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname,'public')));

// home route
app.get('/', function(req, res){ 
    Movie.find({},function(err,movies){
        if(err){
            console.log(err);
        }else{
        res.render('index', {
            title:'Movie Rating App',
            movies : movies
        });
    }

    });
    
});

// get single movie
app.get('/movie/:id',function(req,res){
    Movie.findById(req.params.id,function(err,movie){
        res.render('movie',{
            movie:movie
        });
    });
});



// add route
app.get('/movie/add',function(req,res){
    res.render('add_movie', {
        title:'Add Movie'
    });
});

// Add submit post route

app.post('/movie/add',function(req,res){
    let movie = new Movie();
    movie.title = req.body.title;
    movie.type  = req.body.type;
    movie.body = req.body.body;

    movie.save(function(err){
        if(err){
            console.log(err);
            return;
         }  else{
            res.redirect('/');
        }
    });
});

// load edit form
app.get('/movie/edit/:id',function(req,res){
    Movie.findById(req.params.id,function(err,movie){
        res.render('movie',{
            title: 'Edit Movie',
            movie:movie
        });
    });
});

// edit movie

app.post('/movie/add',function(req,res){
    let movie= {};
    movie.title = req.body.title;
    movie.type  = req.body.type;
    movie.body = req.body.body;

    let query= {_id:req.params.id}

    Movie.update(query,movie, function(err){
        if(err){
            console.log(err);
            return;
         }  else{
            res.redirect('/');
        }
    });
        
 });




// start server
app.listen(3000,function(){
    console.log(" runing");
});