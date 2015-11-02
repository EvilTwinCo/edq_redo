//Express modules
var express =  require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');



//Express Connection
var port = 8080;
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
app.post('/server/confidence', ConfidenceController.create);
app.get('/server/confidence', ConfidenceController.read);
app.delete('/server/confidence/:id', ConfidenceController.delete);

app.post('/server/user', UserController.create);
app.get('/server/user', UserController.read);
app.get('/server/user/:id', UserController.readOne);
app.put('/server/user/:id', UserController.update);
app.delete('/server/user/:id', UserController.delete);

app.post('/server/learningobjective', LearningObjectiveController.create);
app.get('/server/learningobjective', LearningObjectiveController.read);
app.get('/server/learningobjective', LearningObjectiveController.readOne);
app.put('/server/learningobjective', LearningObjectiveController.update);
app.delete('/server/learningobjective', LearningObjectiveController.delete);



//Port Verification
app.listen(port, function(){
  console.log("Listening on port:" + port)
})
