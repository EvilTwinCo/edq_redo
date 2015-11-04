var LearningObjective = require('../models/LearningObjective.js');

module.exports = {
  handleCreateObjective: function(ioServer, socket, data) {
    LearningObjective.create(data, createObjective)
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('learningObjectives', createObjective);
        socket.emit('learningObjectiveCreated', createObjective);
      });
  },
  getAllObjectives: function(ioServer) {
    LearningObjective.find({})
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('getObjectives', result);
        console.log(result);
      });
  },
  updateObjective: function(ioServer, data) {
    LearningObjective.findByIdAndUpdate(data._id, data)
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('updatedObjective', result);
        console.log(result);
      });
  },
  removeObjective: function(ioServer, data) {
    LearningObjective.findByIdAndRemove(data._id)
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('removeObjective', result);
        socket.emit('learningObjectiveRemoved', result);
        console.log(result);
      });
  }
};
