var User = require('../models/User.js');

module.exports = {
    handleCreateUser: function(socket, data) {
      User.create(data, function(err, createUser) {
        if (err) {
          console.log(err);
        }
        socket.emit('profileCreated', createUser);
      });
    },
    getAllUsers: function(socket, data) {
      User.find({})
        .exec(function(err, result) {
          if (err) {
            console.log(err);
          }
          socket.emit('getAllUsers', result);
          console.log(result);
        });
    },
    updateUserInfo: function(socket, data) {
      User.findByIdAndUpdate(data._id, data)
        .exec(function(err, result) {
          if (err) {
            console.log(err);
          }
          socket.emit('userUpdated', result)
          console.log(result);
        });
    },
    removeUser: function(socket, data) {
      User.findByIdAndRemove(data._id)
        .exec(function(err, result) {
          if (err) {
            console.log(err);
          }
          socket.emit('removeUser', result);
          console.log(result);
        });
    }
  };
