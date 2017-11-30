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
  if(username == "fabien" && password == "1234"){

    var newUser = new User({
      user_id     : 1, 
      firstname   : 'Fabien',
      lastname    : 'Joalland',
      username    : 'fjoalland',
      money       : 21654,
      plugins     : []
    });
    res.json(
      "success"   : true,
      "user"      : newUser)
  }
  else if(username == "antoine" && password == "1234"){

    var newUser = new User({
      user_id     : 2, 
      firstname   : 'Antoine',
      lastname    : 'Ando',
      username    : 'fjoalland',
      money       : 3546111,
      plugins     : []
    });
    res.json(
      "success"   : true,
      "user"      : newUser)
  }
  else{
    res.json({
      "success" : false,
      "error"   : "Utilisateur Introuvable",
      "user"    : null
    })
  }
});

app.get('/user/:id', function(req, res, next){
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  User.findOne({ 'user_id': req.params.id }, function (err, user) {
    if (err) console.error(err);
    mongoose.connection.close()
    res.json({
      "id"          : user.user_id,
      "firstname"   : user.firstname,
      "lastname"    : user.lastname,
      "money"       : user.money
    })
  })
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
  var plugins =
    [
      {
        "id"              : 1,
        "title"           : "Treshold",
        "subtitle"        : "Seuil",
        "description"     : "Permets de mettre un plafond sur votre carte à une période déterminée",
        "voteTotal"       : 42,
        "ratings"         : 1.9, 
        "hook"            : "onPayment",
        "options": 
          [{
            "name"  : "Option 1",
            "value" : 55,
            "type"  : "number"
          },{
            "name"  : "Option 2",
            "value" : 55,
            "type"  : "number"
          }]
      },
      {
        "id"              : 2,
        "title"           : "Watcher",
        "subtitle"        : "Alerte SMS",
        "description"     : "Permet de vous envoyer un SMS si vous depassez un certain montant",
        "voteTotal"       : 650,
        "ratings"         : 4.2, 
        "hook"            : "onPayment",
        "options": 
          [{
            "name"  : "Option 1",
            "value" : 55,
            "type"  : "number"
          },{
            "name"  : "Option 2",
            "value" : 55,
            "type"  : "number"
          }]
      },
      {
        "id"              : 3,
      "title"           : "slack",
      "subtitle"        : "Alerte Slack",
      "description"     : "Recevez un message sur Slack lorsque vous effectuez un virement",
        "voteTotal"       : 650,
        "ratings"         : 4.2, 
        "isActivated"     : true,
        "hook"            : "onPayment",
        "options": 
          [{
            "name"  : "Option 1",
            "value" : 55,
            "type"  : "number"
          },{
            "name"  : "Option 2",
            "value" : 55,
            "type"  : "number"
          }]
      },
      {
        "id"              : 4,
        "title"           : "Plugin 4",
        "subtitle"        : "Plugin 4",
        "description"     : "wew",
        "voteTotal"       : 10,
        "ratings"         : 1.2, 
        "hook"            : "onPayment",
        "options": 
          [{
            "name"  : "Option 1",
            "value" : 55,
            "type"  : "number"
          }]
      }
    ]
  res.json(plugins)
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