angular.module('theQ').controller('qInputCtrl', function(socketIoSrvc){

    this.question = this.question;
    //console.log(this.question);
    //this.question = {directive:''};
    var day = [];
    var socket = socketIoSrvc.getSocket();

    socket.on('dayObjectives', function (arr){
      day = arr;
      })

  this.submitQuestion = function (obj) {
      //console.log(this.question);
      if (obj.directive) {
          socket.emit('questionFromStudent', obj);

          //will be a {question: string, objective: string}
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

// dummy data

  // this.day = {
  //   obj1: "learn things",
  //   obj2: "things about things",
  //   obj3: "things about cats",
  //   obj: "things about monkeys",
  //   obj5: "things about cheese"
  // };

  });
