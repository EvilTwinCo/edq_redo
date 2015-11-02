var User = require('../models/User.js');

module.exports = {
    create: function(req, res) {
      User.create(req.body, function(err, result) {
        if (err) {
          return res.status(500).json(err);
        } else {
          return res.status(200).json(result);
        }
      });
    },
    read: function(req, res) {
      User.find({}, function(err, result) {
        if (err) {
          return res.status(500).json(err);
        } else {
          return res.status(200).json(result);
        }
      });
    },
    readOne: function(req, res) {
      User.findById(req.params.id, function(err, result){
        if (err) {
          res.status(500).json(err);
        } else {
          return res.status(200).json(result);
        }
      });
    },
    update: function(req, res) {
      User.findByIdAndUpdate(req.params.id, function(err, result){
        if (err) {
          res.status(500).json(err);
        } else {
          return res.status(200).json(result);
        }
      });
    },
    delete: function(req, res) {
      User.findByIdAndDelete(req.params.id, function(err, result){
        if (err) {
          res.status(500).json(err)
        } else {
          res.status(200).json(result)
        }
      });
    }
};
