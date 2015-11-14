var app = angular.module("theQ").controller("learningObjectiveCtrl", function(socketIoSrvc){

    var socket = socketIoSrvc.getSocket();

    this.submitConfidence = function(objective_id, value, objective_topic, objective_name) {
        var confidenceObj = {
            objective_id: objective_id,
            value: value,
            objective_topic: objective_topic,
            objective_name: objective_name
        }

        //console.log('submitting confidence: ', confidenceObj);
        socket.emit('submit confidence', confidenceObj);
    }
});
