var mongoose = require('mongoose');

var courseTypes = {
  values:"Web iOS UX".split(" "),
  message: 'enum validation failed for math {PATH} with value {VALUE}'
}

var schema = new mongoose.Schema({
    cohortId: {
        type: String,
        required: true
    },
    name: String,
    courseType: {type:String, enum:courseTypes},
    defaultObjectives:[{
      objectiveName:String
    }]

});

module.exports = mongoose.model('Cohort', schema);
