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
var passportSocetIo = require("passport.socketio");
var cookieParser = require("cookie-parser");

var serverPort = 8080;
var mongoURI = 'mongodb://localhost:27017/theQ';

// CONTROLLERS
var ConfidenceController = require('./controllers/ConfidenceController.js');
var UserController = require('./controllers/UserController.js');
var LearningObjectiveController = require('./controllers/LearningObjectiveController.js');
var ConfidenceCtrl = require('./controllers/ConfidenceCtrl');
var DevMntPassportCtrl = require('./controllers/DevMntPassportCtrl.js');
var QuestionCtrl = require('./controllers/QuestionCtrl');
var AttendanceCtrl = require('./controllers/AttendanceCtrl');

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
    maxAge: 1000 * 30
  }, //30 seconds
  store: SessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

// ENDPOINTS
app.post('/confidence', ConfidenceController.create);
app.get('/confidence', ConfidenceController.read);
app.delete('/confidence/:_id', ConfidenceController.delete);

app.post('/user', UserController.create);
app.get('/user', UserController.read);
app.get('/user/:_id', UserController.readOne);
app.put('/user/:_id', UserController.update);
app.delete('/user/:_id', UserController.delete);

app.post('/learningobjective', LearningObjectiveController.create);
app.get('/learningobjective', LearningObjectiveController.read);
app.get('/learningobjective/:_id', LearningObjectiveController.readOne);
app.put('/learningobjective/:_id', LearningObjectiveController.update);
app.delete('/learningobjective/:_id', LearningObjectiveController.delete);

// DEVMNT PASSPORT AUTH
app.get('/auth/devmtn', passport.authenticate('devmtn'), function(req, res) { /*redirects, not called*/ })
app.get('/auth/devmtn/callback', passport.authenticate('devmtn', DevMntPassportCtrl.authFailure), DevMntPassportCtrl.authSuccess);
app.get('/auth/devmtn/logout', DevMntPassportCtrl.authLogout);
passport.use('devmtn', new DevmtnStrategy({
    app: process.env.DM_APP,
    client_token: process.env.DM_AUTH,
    callbackURL: process.env.DM_CALLBACK,
    jwtSecret: process.env.DM_SECRET
}, DevMntPassportCtrl.authLogin));

passport.serializeUser(DevMntPassportCtrl.serializeUser);
passport.deserializeUser(DevMntPassportCtrl.deserializeUser);

// SOCKET.IO EVENT LISTENERS/DISPATCHERS
ioServer.use(passportSocetIo.authorize({
  cookieParser:cookieParser,
  key:'theQCookie.sid',
  secret:SESSION_SECRET,
  store:SessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept){
  console.log("Authorized", data)
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  console.log('socket Auth Failed');
  console.log(message);
  console.log(data);
  if(error){
    throw new Error(message);
    console.log('failed connection to socket.io', message);

  }
  accept(new Error(message));
}

ioServer.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

    socket.on('flash poll', function(answer) {
        console.log('flash poll submitted by a user: ', answer);
        ioServer.emit('flash poll', answer);
    })

    socket.on('submit confidence', ConfidenceCtrl.handleSubmitConfidence.bind(null, socket, ioServer));
    socket.on('instructor login', ConfidenceCtrl.handleInstructorLogin.bind(null, socket));
    socket.on('student Question', QuestionCtrl.handleStudentQuestionSubmit.bind(null, socket, ioServer));
    socket.on('mentor begins help', QuestionCtrl.mentorBegins.bind(null, ioServer));
    socket.on('mentor resolves question', QuestionCtrl.questionResolve.bind(null, socket));
    socket.on('add mentor notes', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
    socket.on('get questions asked', QuestionCtrl.getAllQuestionsAsked.bind(null, socket));
    socket.on('post attendance', AttendanceCtrl.postAttendance.bind(null, socket));
    socket.on('get attendance', AttendanceCtrl.getAttendance.bind(null, socket));

});

mongoose.set('debug', true);
mongoose.connect(mongoURI, function() {
  console.log('Connected to MongoDB: ' + mongoURI);
})

httpServer.listen(serverPort, function() {
  console.log("Server listening on port: " + serverPort);
});
