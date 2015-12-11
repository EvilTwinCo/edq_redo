var User = require('../models/User.js');

module.exports = {
  create: function(req, res) {
    //console.log('create', req.body)
    User.create(req.body, function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  },
  read: function(req, res) {
    User.find({}, function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  },
  readOne: function(req, res) {
    User.findById(req.params._id, function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  },
  update: function(req, res) {
    User.findByIdAndUpdate(req.params._id, req.body, function(err, result) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  },
  delete: function(req, res) {
    User.findByIdAndRemove(req.params._id, function(err, result) {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(result)
      }
    });
  }
};
