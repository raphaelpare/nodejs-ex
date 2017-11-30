//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
var mongoose = require('mongoose');
var UserSchema = require("./dal/models/user.js")
var User = mongoose.model('User', UserSchema);
var PluginSchema = require("./dal/models/plugin.js")
var Plugin = mongoose.model('Plugin', PluginSchema);
var Modules = require('./modules.js');
var cors = require('cors');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors())

var routes = require('./routes/index');
app.use('/', routes);

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

    var newUser = new User({
      firstname   : 'Fabien',
      lastname    : 'Joalland',
      money       : 21654,
      plugins     : [
        {
          "id"              : 1,
          "title"           : "Treshold",
          "subtitle"        : "Seuil",
          "description"     : "Permets de mettre un plafond sur votre carte à une période déterminée",
          "voteTotal"       : 42,
          "ratings"         : 1.9, 
          "isActivated"     : true,
          "isInstalled"     : true,
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
          "isActivated"     : false,
          "isInstalled"     : false,
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
        }
      ]
    });
    res.json(newUser)
  }
});

app.post('/send', function(req, res, next) {

  console.log(req.body);

  var emitter = req.body.id;
  var receiver = req.body.email;
  var money = req.body.money;

  var datas = { "emitter": emitter, "receiver": receiver, "money": money};
  triggerHook("onPayment", emitter, datas);

  User.findOneAndUpdate({ 'user_id': emitter}, {$inc:{'money': -money}}, {new: false}, function(err,doc) {
    if (err) {
      console.error(err);
      res.json({status:'ko', error: err});
    }
    console.log("decrement");
  });

  User.findOneAndUpdate({ 'lastname': receiver}, {$inc:{'money': money}}, {new: false}, function(err,doc) {
    if (err) {
      console.error(err);
      res.json({status:'ko', error: err});
    }
    console.log("increment");
    console.log(doc);
    
    mongoose.connection.close();
    doc.status = 'ok';
    res.json(doc);
  });
  
});

function triggerHook(hook, user, datas) {
  findModulesEnabled(hook, user, function(modules) {
    modules.forEach(function(module) {
      if(module.hook == hook && module.isActivated == true) {
        try {
          var name = module.title;
          console.log("Trigger module : " + name);
          Modules[name](datas);
        } catch(ex) {
          console.log(ex);
        }
      }
    });
  });

}

function findModulesEnabled(hook, user, callback) {

  console.log("kek2 " + user);
  mongoose.connect('mongodb://dodo:dodo@ds123796.mlab.com:23796/heroku_gzc2tsr8');
  User.findOne({ 'user_id': user, 'plugins.hook': hook, 'plugins.isActivated': true }, function (err, user) { 
      if (err) console.error(err);
      
      if(user != null) {
        callback(user.plugins);        
      } else {
        return [];
      }

    });

}

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
