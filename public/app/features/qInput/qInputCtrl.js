angular.module('theQ').controller('qInputCtrl', function (socketIoSrvc) {

    //this.question = this.question;
    var day = [];
    var socket = socketIoSrvc.getSocket();
    this.defaultObjectives = [{objectiveName:"Javascript"}, {objectiveName:"Angular"},{objectiveName:"Express"},{objectiveName:"Mongo"}];

    socket.on('dayObjectives', function (arr) {
        day = arr;
    })

    this.submitQuestion = function (obj) {
        if (obj.directive) {
            socket.emit('student Question', obj)
            this.question = {
                directive: '',
                question: ''
            };
            this.question = obj;
            this.done()
        } else {
            alert('You need to select a directive first...');
        }
    }
});
