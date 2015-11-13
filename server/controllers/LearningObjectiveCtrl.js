var LearningObjective = require('../models/LearningObjective.js');
var request = require('ajax-request');
var dummyData = require('../../dummyData');

module.exports = {
  handleCreateObjective: function(ioServer, socket, data) {

  },
  getAllObjectives: function(socket) {

    getFakeObjectives(socket);
    return false;

    var date = 'Mon Nov 9 2015 17:00:00 GMT-0700 (MST)'; // new Date();
    var userEmail = 'jairuzu@gmail.com'; //socket.request.user.email;
    console.log(userEmail);
    var requestObj = {
      url: "https://class.devmounta.in/api/day-data/" + date + "/"+userEmail,
      method: "GET"
    };

    request(requestObj, function(err, res, body){
      if (err){
        console.log(err);
      } else{
        console.log(body);
        socket.emit('learning objectives are', JSON.parse(body));
      }
    });
  },
  updateObjective: function(ioServer, data) {

  },
  removeObjective: function(ioServer, data) {

  }
};


function getFakeObjectives(socket){
  var timestamp = new Date();
  var number = timestamp.getHours()*timestamp.getDay()*timestamp.getYear();

  var objToReturn = {
    trackables:[],
    objectives:[]
  };
  for(var i=0;i<5;i++){
    objToReturn.trackables.push(dummyData.trackables[(number-i) % 27 ]);
    objToReturn.objectives.push(dummyData.objectives[(number-i) % 30 ]);
  }
  socket.emit('learning objectives are', objToReturn);
}
