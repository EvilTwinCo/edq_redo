var LearningObjective = require('../models/LearningObjective.js');
var request = require('ajax-request');

module.exports = {
  handleCreateObjective: function(ioServer, socket, data) {

  },
  getAllObjectives: function(socket) {

    var date = 'Mon Nov 9 2015 17:00:00 GMT-0700 (MST)' // new Date();
    var userEmail = 'jairuzu@gmail.com' //socket.request.user.email;
    console.log(userEmail);
    var requestObj = {
      url: "https://class.devmounta.in/api/day-data/" + date + "/"+userEmail,
      method: "GET"
    }

    request(requestObj, function(err, res, body){
      if (err){
        console.log(err)
      } else{
        console.log(body);
        socket.emit('learning objectives are', JSON.parse(body));
      }
    })
  },
  updateObjective: function(ioServer, data) {

  },
  removeObjective: function(ioServer, data) {

  }
};
