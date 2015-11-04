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




/* --- UNCOMMENT ONCE WE HAVE MONGO CONTROLLERS ---
var questionsCtrl = require('./controllers/questionsCtrl.js');
var usersCtrl = require('./controllers/usersCtrl.js');
var authCtrl = require('./controllers/authCtrl.js');
var passportDevMtnCtrl = require('./controllers/passportDevMtnCtrl.js');
*/

var serverPort = 8080;
var mongoURI = 'mongodb://localhost:27017/theQ';

//Controllers
var UserCtrl = require('./controllers/UserCtrl.js');
var LearningObjectiveCtrl = require('./controllers/LearningObjectiveCtrl.js');
var ConfidenceCtrl = require('./controllers/ConfidenceCtrl');
var QuestionCtrl = require('./controllers/QuestionCtrl');
var AttendanceCtrl = require('./controllers/AttendanceCtrl');

var corsWhiteList = ['http://localhost:' + serverPort];
var corsOptions = {
    origin: function (origin, callback) {
        if (corsWhiteList.indexOf(origin) !== -1) callback(null, true);
        else callback(null, false);
    }
}

app.use(express.static(__dirname + '/../public'));
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.options(cors(corsOptions));

/* --- UNCOMMENT ONCE WE HAVE AUTH/PASSPORT SET UP ---
var SESSION_SECRET = 'THIS NEEDS TO BE CHANGED AND SHOULD BE AN ENV VARIABLE';
app.use(session({
    secret: SESSION_SECRET,
    name: 'theQCookie.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*30}, //30 minutes
    store: new MongoStore({
        collection: 'connect-mongoSessions',
        autoRemove: 'native',
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());
*/

// ENDPOINTS




/* --- UNCOMMENT ONCE WE HAVE AUTH/PASSPORT SET UP ---
passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(user, done) {done(null, user);});
*/

// SOCKET.IO EVENT LISTENERS/DISPATCHERS
ioServer.use(function(socket, next) {
    console.log('middleware opportunity... could use for auth');
    next();
});

ioServer.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    });

    socket.on('flash poll', function(answer) {
        console.log('flash poll submitted by a user: ', answer);
        ioServer.emit('flash poll', answer);
    })
    //User Sockets
    socket.on('create user', UserCtrl.handleCreateUser.bind(null, socket));
    socket.on('get users', UserCtrl.getAllUsers.bind(null, socket));
    socket.on('update user', UserCtrl.updateUserInfo.bind(null, socket));
    socket.on('remove user', UserCtrl.removeUser.bind(null, socket));

    //Learning Objective Sockets
    socket.on('create learning objective', LearningObjectiveCtrl.handleCreateObjective.bind(null, ioServer, socket));
    socket.on('get all learning objectives', LearningObjectiveCtrl.getAllObjectives.bind(null, ioServer));
    socket.on('update learning objective', LearningObjectiveCtrl.updateObjective.bind(null, ioServer));
    socket.on('remove objective', LearningObjectiveCtrl.removeObjective.bind(null, ioServer, socket));

    //Confidence Sockets
    socket.on('submit confidence', ConfidenceCtrl.handleSubmitConfidence.bind(null, socket, ioServer));
    socket.on('instructor login', ConfidenceCtrl.handleInstructorLogin.bind(null, socket));

    //Question Sockets
    socket.on('student Question', QuestionCtrl.handleStudentQuestionSubmit.bind(null, ioServer));
    socket.on('mentor begins', QuestionCtrl.mentorBegins.bind(null, ioServer));
    socket.on('question resolve', QuestionCtrl.questionResolve.bind(null, socket));
    socket.on('add question and solution', QuestionCtrl.addingQuestionAndSolution.bind(null, socket));
    socket.on('get questions asked', QuestionCtrl.getAllQuestionsAsked.bind(null, socket));

    //Attendance Sockets
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
