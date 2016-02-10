var mongoose = require('mongoose');
var Alias = require('./../models/Alias.js');
var _ = require('underscore');

module.exports = {
    readAll: function (req, res) {
        Alias.find({}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    readOne: function (req, res) {
        Alias.find({_id: req.params.id}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    create: function (req, res) {
        //console.log('Alias.create req.body = ', req.body);
        Alias.create(req.body, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    update: function (req, res) {
        console.log('Alias.update req.body = ', req.body);
        Alias.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    delete: function (req, res) {
        Alias.findByIdAndRemove(req.params.id, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
}
