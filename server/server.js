var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var httpServer = require('http').Server(app);
var SocketIOServer = require('socket.io');
var ioServer = new SocketIOServer(httpServer);
var Devmtn = require('devmtn-auth');
var DevmtnStrategy = Devmtn.Strategy;
var User = require('./models/User.js');
var passportSocketIo = require("passport.socketio");
var cookieParser = require("cookie-parser");

var serverPort = 8080;
var mongoURI = 'mongodb://localhost:27017/theQ';


//Controllers
var UserCtrl = require('./controllers/UserCtrl.js');
var LearningObjectiveCtrl = require('./controllers/LearningObjectiveCtrl.js');
var ConfidenceCtrl = require('./controllers/ConfidenceCtrl');
var DevMtnPassportCtrl = require('./controllers/DevMtnPassportCtrl.js');
var QuestionCtrl = require('./controllers/QuestionCtrl');
var AttendanceCtrl = require('./controllers/AttendanceCtrl');
var FlashPollCtrl = require('./controllers/FlashPollCtrl');
var CohortCtrl = require('./controllers/CohortCtrl');

var corsWhiteList = ['http://localhost:' + serverPort];
var corsOptions = {
  origin: function(origin, callback) {
    if (corsWhiteList.indexOf(origin) !== -1) callback(null, true);
    else callback(null, false);
  }
}

app.use(express.static(__dirname + '/../public'));
app.use(cors());
//app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.options(cors(corsOptions));

var SessionStore = new MongoStore({
  collection: 'connect-mongoSessions',
  autoRemove: 'native',
  mongooseConnection: mongoose.connection
})
var SESSION_SECRET = process.env.DM_SESSION;
app.use(session({
  secret: SESSION_SECRET,
  name: 'theQCookie.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30
  }, //30 minutes
  store: SessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

// devMtn PASSPORT AUTH
app.get('/auth/devmtn', passport.authenticate('devmtn'), function(req, res) { /*redirects, not called*/ })
app.get('/auth/devmtn/callback', passport.authenticate('devmtn', DevMtnPassportCtrl.authFailure), DevMtnPassportCtrl.authSuccess);
app.get('/auth/devmtn/logout', DevMtnPassportCtrl.authLogout);
passport.use('devmtn', new DevmtnStrategy({
  app: process.env.DM_APP,
  client_token: process.env.DM_AUTH,
  callbackURL: process.env.DM_CALLBACK,
  jwtSecret: process.env.DM_SECRET
}, DevMtnPassportCtrl.authLogin));

passport.serializeUser(DevMtnPassportCtrl.serializeUser);
passport.deserializeUser(DevMtnPassportCtrl.deserializeUser);

// SOCKET.IO EVENT LISTENERS/DISPATCHERS
ioServer.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'theQCookie.sid',
  secret: SESSION_SECRET,
  store: SessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept) {
  //console.log("Authorized", data)
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  // error indicates whether the fail is due to an error or just a unauthorized client
  if (error) throw new Error(message);
  // send the (not-fatal) error-message to the client and deny the connection
  return accept(new Error(message));

}


ioServer.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });


  // Flash poll Sockets


  socket.on('studentFlashPoll', FlashPollCtrl.handleFlashPollSubmit.bind(null, socket));
  socket.on('removeStudentFlashPollData', FlashPollCtrl.handleFlashPollRemoval.bind(null, socket));

  //View Sockets
  socket.on('request reset view data', function() {
    socket.emit('reset view data');
  });

  //User Sockets
  socket.on('create user', UserCtrl.handleCreateUser.bind(null, socket));
  socket.on('get users', UserCtrl.getAllUsers.bind(null, socket));
  socket.on('update user', UserCtrl.updateUserInfo.bind(null, socket));
  socket.on('remove user', UserCtrl.removeUser.bind(null, socket));

  //Learning Objective Sockets
  //socket.on('create learning objective', LearningObjectiveCtrl.handleCreateObjective.bind(null, ioServer, socket));
  socket.on('get all learning objectives', LearningObjectiveCtrl.getAllObjectives.bind(null, socket));
  //socket.on('update learning objective', LearningObjectiveCtrl.updateObjective.bind(null, ioServer));
  //socket.on('remove objective', LearningObjectiveCtrl.removeObjective.bind(null, ioServer, socket));

  //Confidence Sockets
  socket.on('submit confidence', ConfidenceCtrl.handleSubmitConfidence.bind(null, socket, ioServer));
  socket.on('instructor login', ConfidenceCtrl.handleInstructorLogin.bind(null, socket));
  socket.on('get current confidences', ConfidenceCtrl.handleGetCurrentConfidences.bind(null, socket));

  //Question Sockets
  socket.on('student Question', QuestionCtrl.handleStudentQuestionSubmit.bind(null, socket, ioServer));
  socket.on('mentor begins', QuestionCtrl.mentorBegins.bind(null, socket, ioServer));
  socket.on('question resolve', QuestionCtrl.questionResolve.bind(null, socket));
  socket.on('add question and solution', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
  socket.on('mentor resolves question', QuestionCtrl.questionResolve.bind(null, socket));
  socket.on('add mentor notes', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
  socket.on('get questions asked', QuestionCtrl.getAllQuestionsAsked.bind(null, socket));
  socket.on('get my current question', QuestionCtrl.qetMyCurrentQuestion.bind(null, socket));
  socket.on('studentSolution', QuestionCtrl.handleStudentSolution.bind(null, socket));
  socket.on('studentDropFromQueueTime', QuestionCtrl.handleStudentDropFromQueue.bind(null, socket));
  socket.on('request question removal', QuestionCtrl.handleQuestionRemovalRequest.bind(null, socket, ioServer));

  //Attendance Sockets
  socket.on('post attendance', AttendanceCtrl.postAttendance.bind(null, socket));
  socket.on('get attendance', AttendanceCtrl.getAttendance.bind(null, socket));

app.get('/admin/cohorts', CohortCtrl.getCohortIdOptions);

ioServer.on('connection', function (socket) {
    var devMtnId = socket.request.user.devMtn.id;
    console.log('user ' + devMtnId + ' connected');

    socket.on('disconnect', function () {
        console.log('user ' + devMtnId + ' disconnected');
    });


    // Flash poll Sockets
    socket.on('studentFlashPoll', FlashPollCtrl.handleFlashPollSubmit.bind(null, socket));

    //View Sockets
    socket.on('request reset view data', function() {socket.emit('reset view data')});

    //User Sockets
    socket.on('create user', UserCtrl.handleCreateUser.bind(null, socket));
    socket.on('get users', UserCtrl.getAllUsers.bind(null, socket));
    socket.on('update user', UserCtrl.updateUserInfo.bind(null, socket));
    socket.on('remove user', UserCtrl.removeUser.bind(null, socket));

    //Learning Objective Sockets
    //socket.on('create learning objective', LearningObjectiveCtrl.handleCreateObjective.bind(null, ioServer, socket));
    socket.on('get all learning objectives', LearningObjectiveCtrl.getAllObjectives.bind(null, socket));
    //socket.on('update learning objective', LearningObjectiveCtrl.updateObjective.bind(null, ioServer));
    //socket.on('remove objective', LearningObjectiveCtrl.removeObjective.bind(null, ioServer, socket));

    //Confidence Sockets
    socket.on('submit confidence', ConfidenceCtrl.handleSubmitConfidence.bind(null, socket, ioServer));
    socket.on('instructor login', ConfidenceCtrl.handleInstructorLogin.bind(null, socket));
    socket.on('get current confidences', ConfidenceCtrl.handleGetCurrentConfidences.bind(null, socket))

    //Question Sockets
    socket.on('student Question', QuestionCtrl.handleStudentQuestionSubmit.bind(null, socket, ioServer));
    socket.on('mentor begins', QuestionCtrl.mentorBegins.bind(null, socket, ioServer));
    socket.on('question resolve', QuestionCtrl.questionResolve.bind(null, socket));
    socket.on('add question and solution', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
    socket.on('mentor resolves question', QuestionCtrl.questionResolve.bind(null, socket));
    socket.on('add mentor notes', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
    socket.on('get questions asked', QuestionCtrl.getAllQuestionsAsked.bind(null, socket));
    socket.on('get my current question', QuestionCtrl.qetMyCurrentQuestion.bind(null, socket));
    socket.on('studentSolution', QuestionCtrl.handleStudentSolution.bind(null, socket));
    socket.on('studentDropFromQueueTime', QuestionCtrl.handleStudentDropFromQueue.bind(null, socket));
    socket.on('request question removal', QuestionCtrl.handleQuestionRemovalRequest.bind(null, socket, ioServer));

    //Attendance Sockets
    socket.on('postAttendance', AttendanceCtrl.postAttendance.bind(null, socket));
    socket.on('getAttendance', AttendanceCtrl.getAttendance.bind(null, socket));
})

mongoose.set('debug', true);
mongoose.connect(mongoURI, function() {
  console.log('Connected to MongoDB: ' + mongoURI);
})

httpServer.listen(serverPort, function() {
  console.log("Server listening on port: " + serverPort);
})
