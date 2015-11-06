var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email: {type: String, required: true, unique: true, index: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    imageUrl: {type: String},
    logins: [{type: Date}],
    devMtn: {
        id: {type: String},
        roles: [{}],
        cohortId: {type: String},
    }
});

module.exports = mongoose.model('User', schema);