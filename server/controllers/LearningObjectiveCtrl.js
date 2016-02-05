var LearningObjective = require('../models/LearningObjective.js');
var request = require('ajax-request');
var dummyData = require('../../dummyData');
var _ = require('underscore');

module.exports = {
  handleCreateObjective: function(ioServer, socket, data) {

  },
  getAllObjectives: function(socket) {

    // getFakeObjectives(socket);
    // return false;

    var date = new Date();

    // TODO Swap below to work on userEmail at future date once cohorts has a students array.
    // =======================
    var userCohortId = socket.request.user.devMtn.cohortId;
    var requestObj = {
      url: "http://class.devmounta.in/api/day-data/" + date + "/" + userCohortId,
      method: "GET"
    };

    // var userEmail = socket.request.user.email;
    // var requestObj = {
    //   url: "http://class.devmounta.in/api/day-data/" + date + "/" + userEmail,
    //   method: "GET"
    // };
    // =======================

    request(requestObj, function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        if (!body){
          return;
        }
        body = JSON.parse(body);

        body.trackables = _.filter(body.trackables, function(item) {
          return item.sectionContent;
        })

        body.trackables = _.uniq(body.trackables, false, function(item) {
          return item.sectionContent.match(/>([^<>]+)</)[1];
        });

        body.trackables.map(function(item) {
          item.sectionContent = item.sectionContent.replace(/<a /g, "<a target=\"_blank\" ");
          return item;
        });

        socket.emit('learning objectives are', body);
      }
    });
  },
  updateObjective: function(ioServer, data) {

  },
  removeObjective: function(ioServer, data) {

  }
};


function getFakeObjectives(socket) {
  var timestamp = new Date();
  var number = timestamp.getHours() * timestamp.getDay() * timestamp.getYear();

  var objToReturn = {
    trackables: [],
    objectives: []
  };
  for (var i = 0; i < 5; i++) {
    objToReturn.trackables.push(dummyData.trackables[(number - i) % dummyData.trackables.length]);
    objToReturn.objectives.push(dummyData.objectives[(number - i) % dummyData.objectives.length]);
  }
  socket.emit('learning objectives are', objToReturn);
}
