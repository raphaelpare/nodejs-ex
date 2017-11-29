//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
var mongoose = require('mongoose');
var UserSchema = require("./dal/models/User.js")
var User = mongoose.model('User', UserSchema);
var PluginSchema = require("./dal/models/Plugin.js")
var Plugin = mongoose.model('Plugin', PluginSchema);
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = "ds123796.mlab.com"/*process.env[mongoServiceName + '_SERVICE_HOST']*/,
      mongoPort = 23796/*process.env[mongoServiceName + '_SERVICE_PORT']*/,
      mongoDatabase = "heroku_gzc2tsr8"/*process.env[mongoServiceName + '_DATABASE']*/,
      mongoPassword = "dodo"/*process.env[mongoServiceName + '_PASSWORD']*/
      mongoUser = "dodo"/*process.env[mongoServiceName + '_USER']*/;

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.get('/bank', function(req, res, next) {
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {

    var newUser = new User({
      firstname   : 'Dodo',
      lastname  : 'Le Dodo',
      money   : 21654,
      plugins   : {}
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


app.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if(username == "fabien" && password == "dodo"){

    var newPlugin = 

    var newUser = new User({
      firstname   : 'Fabien',
      lastname    : 'Joalland',
      money       : 21654,
      plugins     : [
        {
          title           : "Plugin 1",
          subtitle        : "...",
          description     : "Super plugin",
          votes_number    : 42,
          ratings         : 1.9, 
          isActivated     : true,
          isInstalled     : true,
          hook            : "onPayment",
          options: {
            limit: 50,
            truc:  10
          }
        },
        {
          title           : "Plugin 2",
          subtitle        : "...",
          description     : "Super plugin",
          votes_number    : 650,
          ratings         : 4.2, 
          isActivated     : false,
          isInstalled     : false,
          hook            : "onPayment",
          options: {
            limit: 50,
            truc:  10
          }
        },
        {
          title           : "Plugin 3",
          subtitle        : "...",
          description     : "Super plugin",
          votes_number    : 12,
          ratings         : 5.0, 
          isActivated     : false,
          isInstalled     : true,
          hook            : "onPayment",
          options: {
            limit: 50,
            truc:  10
          }
        }
      ]
    });
    res.json(newUser)
  }
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
