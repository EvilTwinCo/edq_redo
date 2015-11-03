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
var mongoURI = 'mongod://localhost:27017/theQ';

//Controllers
var ConfidenceController = require('./controllers/ConfidenceController.js');
var UserController = require('./controllers/UserController.js');
var LearningObjectiveController = require('./controllers/LearningObjectiveController.js');
var ConfidenceCtrl = require('./controllers/ConfidenceCtrl');
var QuestionCtrl = require('./controllers/QuestionCtrl');

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

    socket.on('submit confidence', ConfidenceCtrl.handleSubmitConfidence.bind(null, socket, ioServer));
    socket.on('instructor login', ConfidenceCtrl.handleInstructorLogin.bind(null, socket));
    socket.on('student Question', QuestionCtrl.handleStudentQuestionSubmit.bind(null, ioServer));
});

mongoose.set('debug', true);
mongoose.connect(mongoURI, function() {
    console.log('Connected to MongoDB: ' + mongoURI);
})

httpServer.listen(serverPort, function() {
    console.log("Server listening on port: " + serverPort);
});
