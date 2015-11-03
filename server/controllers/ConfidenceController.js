var Confidence = require('../models/Confidence.js');

module.exports = {
  create: function(req, res) {
    Confidence.create(req.body, function(err, result){
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.status(200).json(result);
      }
    });
  },

  read: function(req, res) {
    Confidence.find({}, function(err, result){
      if (err) {
        return res.status(500).json(err);
      } else {
        return res.status(200).json(result);
      }
    });
  },

  delete: function(req, res) {
    Confidence.findByIdAndRemove(req.params._id, function(err, result){
      if (err) {
        console.log("error", err);
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
        console.log("result", result);
      }
    });
  }
};
