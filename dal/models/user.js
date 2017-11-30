var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = new Schema({
    id    			: ObjectId,
    user_id			: Number,
    firstname     	: String,
    lastname      	: String,
    money      		: Number,
    plugins			: {type : Array, default : null}
});