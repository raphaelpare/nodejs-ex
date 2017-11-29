var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = new Schema({
    id    			: ObjectId,
    title     		: String,
    subtitle      	: String,
    description    	: String,
	voteTotal		: Number,
	ratings			: Number, 
	isActivated		: Boolean,
	isInstalled		: Boolean,
	hook			: String
});