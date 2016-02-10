var mongoose = require('mongoose');

var aliasSchema = new mongoose.Schema({

    cohortId: {
        type: String
    },
    alias: {
        type: String
    }
    
});

module.exports = mongoose.model('Alias', aliasSchema);
