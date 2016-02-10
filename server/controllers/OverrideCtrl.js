var mongoose = require('mongoose');
var Override = require('./../models/Override.js');
var _ = require('underscore');

module.exports = {
    readAll: function (req, res) {
        Override.find({}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    readOne: function (req, res) {
        Override.find({_id: req.params.id}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    create: function (req, res) {
        //console.log('Override.create req.body = ', req.body);
        Override.create(req.body, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    update: function (req, res) {
        console.log('Override.update req.body = ', req.body);
        Override.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },
    delete: function (req, res) {
        Override.findByIdAndRemove(req.params.id, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
}
