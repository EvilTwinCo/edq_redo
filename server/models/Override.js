var mongoose = require('mongoose');

var overrideSchema = new mongoose.Schema({

    studentEmail: {
        type: String
    },
    cohortIdOverride: {
        type: String
    }

});

module.exports = mongoose.model('Override', overrideSchema);
