//Express modules
var express =  require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');

//Mongoose Connection
var mongoURI = 'mongodb://localhost:27017/edq_redo';
mongoose.set('debug', true);
mongoose.connect(mongoURI);
mongoose.connection.once('open', function() {
  console.log('Connected to mongoDB at: ', mongoURI);
});


//Express Connection
var port = 3000;
var app = express();

app
  .use(bodyParser.json())
  .use(cors())
  .use(express.static(__dirname + '/public'))
  .use(session({secret: 'secret'}));

//Controllers
var ConfidenceController = require('./controllers/ConfidenceController.js');
var UserController = require('./controllers/UserController.js');
var LearningObjectiveController = require('./controllers/LearningObjectiveController.js');


//Endpoints
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



//Port Verification
app.listen(port, function(){
  console.log("Listening on port:" + port)
})
