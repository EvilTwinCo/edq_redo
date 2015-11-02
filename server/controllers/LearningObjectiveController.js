var LearningObjective = require('../models/LearningObjective.js');

module.exports = {
  create: function(req, res) {
    LearningObjective.create(req.body, function(err, result){
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
},
  read: function(req, res) {
    LearningObjective.find({}, function(err, result){
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  },
  readOne: function(req, res) {
    LearningObjective.findById(req.params.id, function(err, result){
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result)
      }
    });
  },
  update: function(req, res) {
    LearningObjective.findByIdAndUpdate(req.params.id, function(err, result){
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  },
  delete: function(req, res) {
    LearningObjective.findByIdAndDelete(req.params.id, function(err, result){
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  }
};
