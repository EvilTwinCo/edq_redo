angular.module('theQ').controller('mentorQueueCtrl', function (socketIoSrvc, $scope) {

    var socket = socketIoSrvc.getSocket();

    this.questions = [];

    socket.emit('get questions asked');

    socket.on('questionForQueue', function (data) {
        this.questions.push(data);
        $scope.$apply();
    }.bind(this));

    socket.on('getAllQuestionsAsked', function (data) {
        this.questions = data;
        $scope.$apply();
    }.bind(this));

    socket.on('remove question from queue', function (question) {
        this.questions = _.filter(this.questions, function (item) {
            return item.studentId !== question.studentId;
        })
        $scope.$apply();
    }.bind(this));

    socket.on('mentorBegins', function(updatedQuestion){
      _.findWhere(this.questions, {studentId:updatedQuestion.studentId}).mentorName  = updatedQuestion.mentorName;
    }.bind(this))

    this.ObjectEntersQ = function (object) {
        object.timeWhenEnteredQ = new Date();
    }

    this.mentorBegins = function (object) {
        object.timeMentorBegins = new Date();
        //need mentor name
        //object.mentorName = "Smelly guy"
        socket.emit('mentor begins help', object)
    };

    this.questionResolve = function (object) {
        object.timeQuestionAnswered = new Date();
        object.removing = true;
        socket.emit('mentor resolves question', object);
    };

    this.addingQuestionAndSolution = function (object) {
        socket.emit('add mentor notes', object);
        socket.emit('request question removal', object);
    };


    //dummy data
    //  this.questions = [
    //
    //    {name:'bob', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie shoes??", solution: '', mentorName: 'MARK'},
    //    {name:'joe', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie knots??", solution: '', mentorName: 'MARK'},
    //    {name:'mary', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie ties??", solution: '', mentorName: ''},
    //    {name:'paul', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie the knote??", solution: '', mentorName: 'MARK'},
    //    {name:'Ringo', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie a bow??", solution: '', mentorName: 'MARK'}
    //
    // ]

    //endter q, mentorbegins help, leaveQ

})
