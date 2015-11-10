var app = angular.module("theQ").controller("learningObjectiveCtrl", function(socketIoSrvc){

    var socket = socketIoSrvc.getSocket();

    // this.learningObjectives = [
    //     {id: "123456", title: "Creating a folder", percentage: 0},
    //     {id: "ABCDEF", title: "Creating a file", percentage: 0},
    //     {id: "xyz", title: "Editing a file", percentage: 0},
    //     {id: "098765", title: "Changing Directories", percentage: 0}
    // ]

    this.submitConfidence = function(objective_id, value) {
        var confidenceObj = {
            objective_id: objective_id,
            value: value
        }

        //console.log('submitting confidence: ', confidenceObj);
        socket.emit('submit confidence', confidenceObj);
    }
});
