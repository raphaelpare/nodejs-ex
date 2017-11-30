var express = require('express');
var mongoose = require('mongoose');
var UserSchema = require("../dal/models/user.js")
var User = mongoose.model('User', UserSchema);
var app = express.Router();

/*
  app.get('/bank', function(req, res, next) {
    mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {

      var newUser = new User({
        firstname   : 'Dodo',
        lastname    : 'Le Dodo',
        money       : 21654,
        plugins     : []
      });
      
      newUser.save(function (err, response) {
        if (err){
          res.json(err);
        }
        else{
          res.json(response);
        }
        mongoose.connection.close()
      });
    });
  });
*/

app.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if(username == "fabien" && password == "dodo"){

    var newUser = new User({
      id          : 1, 
      firstname   : 'Fabien',
      lastname    : 'Joalland',
      username    : 'jfabien',
      money       : 21654,
      plugins     : []
    });
    res.json(newUser)
  }
});

app.get('/user/:id/plugins', function(req, res, next){
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  User.findOne({ 'user_id': req.params.id }, 'plugins', function (err, user) {
    if (err) console.error(err);
    mongoose.connection.close()
    res.json(user.plugins)
  })
});

app.post('/user/:id/plugins', function(req, res, next){
  console.log(req.body)
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  User.findOne({ 'user_id': req.params.id }, 'plugins', function (err, user) {
    if (err) console.error(err);
    User.update(  { 'user_id' : req.params.id } , { $set: { plugins : req.body.plugins } } , function(error, user){
      if(error) console.error(error)
      res.json(user)
      mongoose.connection.close()
    })
  })
})

app.get('/store', function(req, res, next){
  var plugins = {
    
  }
  res.json(user.plugins)
});

app.post('/user/:id/plugins', function(req, res, next){
  console.log(req.body)
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  User.findOne({ 'user_id': req.params.id }, 'plugins', function (err, user) {
    if (err) console.error(err);
    User.update(  { 'user_id' : req.params.id } , { $set: { plugins : req.body.plugins } } , function(error, user){
      if(error) console.error(error)
      res.json(user)
      mongoose.connection.close()
    })
  })
})



/*
app.post('/create_users', function(req, res, next){
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  new User({
    user_id     : 1, 
    firstname   : 'Fabien',
    lastname    : 'Joalland',
    username    : 'jfabien',
    money       : 21654,
    plugins     : []
  }).save(function (err, response) {
      if (err){
        res.json(err);
      }
    })

  new User({
    user_id     : 2, 
    firstname   : 'Antoine',
    lastname    : 'Ando',
    username    : 'aantoine',
    money       : 161651,
    plugins     : []
  }).save(function (err, response) {
    if (err){
      res.json(err);
    }
    else{
      res.json(response);
    }
    mongoose.connection.close()
  })
})
*/


module.exports = app;