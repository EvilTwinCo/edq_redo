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
var _ = require('underscore');

var configSettings = require("./config.js");

var serverPort = configSettings.port || 8003;
var mongoURI = 'mongodb://localhost:27017/theQ';

//Controllers
var UserCtrl = require('./controllers/UserCtrl.js');
var LearningObjectiveCtrl = require('./controllers/LearningObjectiveCtrl.js');
var ConfidenceCtrl = require('./controllers/ConfidenceCtrl.js');
var DevMtnPassportCtrl = require('./controllers/DevMtnPassportCtrl.js');
var QuestionCtrl = require('./controllers/QuestionCtrl.js');
var AttendanceCtrl = require('./controllers/AttendanceCtrl.js');
var FlashPollCtrl = require('./controllers/FlashPollCtrl.js');
var CohortCtrl = require('./controllers/CohortCtrl.js');
var AliasCtrl = require('./controllers/AliasCtrl.js');
var OverrideCtrl = require('./controllers/OverrideCtrl.js');

var corsWhiteList = ['http://localhost:' + serverPort];
var corsOptions = {
  origin: function(origin, callback) {
    if (corsWhiteList.indexOf(origin) !== -1) callback(null, true);
    else callback(null, false);
  }
};

app.use(express.static(__dirname + '/../public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.options(cors(corsOptions));

var SessionStore = new MongoStore({
  collection: 'connect-mongoSessions',
  autoRemove: 'native',
  mongooseConnection: mongoose.connection
});
var SESSION_SECRET = configSettings.DM_SESSION;
app.use(session({
  secret: SESSION_SECRET,
  name: 'theQCookie.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //24 hours cookie length
  },
  store: SessionStore
}));

app.use(passport.initialize());
app.use(passport.session());

// devMtn PASSPORT AUTH
app.get('/auth/devmtn', passport.authenticate('devmtn'), function(req, res) { /*redirects, not called*/ });
app.get('/auth/devmtn/callback', passport.authenticate('devmtn', DevMtnPassportCtrl.authFailure), DevMtnPassportCtrl.authSuccess);
app.get('/auth/devmtn/logout', DevMtnPassportCtrl.authLogout);
passport.use('devmtn', new DevmtnStrategy({
  app: configSettings.DM_APP,
  client_token: configSettings.DM_AUTH,
  callbackURL: configSettings.DM_CALLBACK,
  jwtSecret: configSettings.DM_SECRET
}, DevMtnPassportCtrl.authLogin));

//passportLocalCtrl.setup;
//app.post('/auth/passportLocal', passportLocalCtrl.auth);
//app.get('/auth/passportLocal/setUser', passportLocalCtrl.setUser);

app.get('/logout', function(req, res){
  //console.log('Logging out user', req.user);
  if(req.user){
    console.log(req.user.firstName + ' ' + req.user.lastName + ' is logging out.');
    req.logout();
    //console.log('req.session', req.session);
    req.session.destroy(function(err){console.log('session destroyed.', err);});
  }

  //console.log('req.session', req.session);
  res.redirect('/#/logout');

});

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
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  // error indicates whether the fail is due to an error or just a unauthorized client
  if (error) throw new Error(message);
  // send the (not-fatal) error-message to the client and deny the connection
  return accept(new Error(message));
}

app.get('/admin/confidences/:cohortId', ConfidenceCtrl.getDatabaseConfidences);
app.get('/admin/cohorts', isAdmin, CohortCtrl.getCohortIdOptions);
app.get('/admin/confidences/user/:userId/:learningObjId', ConfidenceCtrl.getUserLearningObjConfidences);
app.get('/admin/attendances/:date/:cohortId', AttendanceCtrl.getRecordedAttendanceForDateByCohort);
app.get('/admin/aliases', isAdmin, AliasCtrl.readAll);
app.post('/admin/aliases', isAdmin, AliasCtrl.create);
app.get('/admin/aliases/:id', isAdmin, AliasCtrl.readOne);
app.put('/admin/aliases/:id', isAdmin, AliasCtrl.update);
app.delete('/admin/aliases/:id', isAdmin, AliasCtrl.delete);
app.get('/admin/overrides', isAdmin, OverrideCtrl.readAll);
app.post('/admin/overrides', isAdmin, OverrideCtrl.create);
app.get('/admin/overrides/:id', isAdmin, OverrideCtrl.readOne);
app.put('/admin/overrides/:id', isAdmin, OverrideCtrl.update);
app.delete('/admin/overrides/:id', isAdmin, OverrideCtrl.delete);

app.get('/admin/questions', QuestionCtrl.getQuestionsByQuery);

function isAdmin(req, res, next) {
    //console.log(req.user);
    if (req.user) {
        var roles = _.pluck(req.user.devMtn.roles, 'role');
        //console.log(roles);
        if (roles.indexOf('admin') !== -1 ||
            roles.indexOf('mentor') !== -1 ||
            roles.indexOf('instructor') !== -1 ||
            roles.indexOf('lead_instructor') !== -1)  {
            //console.log(req.user.firstName + ' ' + req.user.lastName + ' is authorized for admin pages and has the following roles: ' + roles);
            next();
        } else {
            console.log(req.user.firstName + ' ' + req.user.lastName + ' tried to view admin pages or use admin endpoints but is not authorized.  He/She has the following roles: ' + roles);
            res.json({redirect: '/#/studentDashboard'});
        }
    } else {
        console.log('A user without a req.user session tried to access admin pages or use admin endpoints.');
        res.json({redirect: '/#/studentDashboard'});
    }
}

ioServer.on('connection', function (socket) {
    var devMtnId = socket.request.user.devMtn.id;
    //console.log('user ' + devMtnId + ' connected');

    socket.on('disconnect', function () {
    //console.log('user ' + devMtnId + ' disconnected');
    });

    // Flash poll Sockets
    socket.on('studentFlashPoll', FlashPollCtrl.handleFlashPollSubmit.bind(null, socket));
    socket.on('removeStudentFlashPollData', FlashPollCtrl.handleFlashPollRemoval.bind(null, socket));
    socket.on('client request: get flash poll status', FlashPollCtrl.handleFlashPollGetStatus.bind(null, socket));

    //View Sockets
    socket.on('request reset view data', function() {
        socket.emit('reset view data');
    });

    //User Sockets
    socket.on('instructor login', UserCtrl.handleInstructorLogin.bind(null, socket));
    socket.on('student login', UserCtrl.handleStudentLogin.bind(null, socket));
    socket.on('client request: get auth level', UserCtrl.handleGetAuthRequest.bind(null, socket));

    //Learning Objective Sockets
    socket.on('get all learning objectives', LearningObjectiveCtrl.getAllObjectives.bind(null, socket));

    //Confidence Sockets
    socket.on('submit confidence', ConfidenceCtrl.handleSubmitConfidence.bind(null, socket, ioServer));

    socket.on('get current confidences', ConfidenceCtrl.handleGetCurrentConfidences.bind(null, socket));

    //Question Sockets
    socket.on('student Question', QuestionCtrl.handleStudentQuestionSubmit.bind(null, socket, ioServer));
    socket.on('mentor begins', QuestionCtrl.mentorBegins.bind(null, socket, ioServer));
    socket.on('question resolve', QuestionCtrl.questionResolve.bind(null, socket));
    socket.on('mentor resolves question', QuestionCtrl.questionResolve.bind(null, socket));
    socket.on('add mentor notes', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
    socket.on('get questions asked', QuestionCtrl.getAllQuestionsAsked.bind(null, socket));
    socket.on('get my current question', QuestionCtrl.getMyCurrentQuestion.bind(null, socket));
    socket.on('studentSolution', QuestionCtrl.handleStudentSolution.bind(null, socket));
    socket.on('studentDropFromQueueTime', QuestionCtrl.handleStudentDropFromQueue.bind(null, socket));
    socket.on('request question removal', QuestionCtrl.handleQuestionRemovalRequest.bind(null, socket, ioServer));
    socket.on('request queue stats', QuestionCtrl.handleStatsQuery.bind(null, socket));
    socket.on('client request: initial live feed queue', QuestionCtrl.handleLiveFeedQueueRequest.bind(null, socket));
    socket.on('mentor post: live feed', QuestionCtrl.handleMentorLiveFeed.bind(null, socket));

    //Attendance Sockets
    socket.on('postAttendance', AttendanceCtrl.postAttendance.bind(null, socket));
    socket.on('getAttendance', AttendanceCtrl.getAttendance.bind(null, socket));
    socket.on('getAllAttendanceOfCohort', AttendanceCtrl.getAllAttendanceOfCohort.bind(null, socket));

});

//mongoose.set('debug', true);
mongoose.connect(mongoURI, function() {
  console.log('Connected to MongoDB: ' + mongoURI);
});

httpServer.listen(serverPort, function() {
  console.log("Server listening on port: " + serverPort);
});
