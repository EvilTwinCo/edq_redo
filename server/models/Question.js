var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mentorName: {
    type: String
  },
  imageUrl: {
    type: String
  },
  question:{
    type:String,
    required:true
  },
  directive:{
    type:String,
    required:true
  },
  timeWhenEntered:{
    type:Date,
    required:true
  },
  timeMentorBegins:{
    type:Date
  },
  timeQuestionAnswered:{
    type:Date
  },
  solutions:[{
    solution:String,
    public:Boolean,
    name:String
  }]
});

module.exports = mongoose.model('Question', schema);
