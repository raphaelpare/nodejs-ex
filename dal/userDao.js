var mongoose = require('mongoose');
var User = require("./models/User.js")

module.exports = function UserDao(credentials){
	mongoose.connect('mongodb://dodo:dodo@mongodb-bank.193b.starter-ca-central-1.openshiftapps.com:27017');
	this.insertArticle = function(user){

	}

}