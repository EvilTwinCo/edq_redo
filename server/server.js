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


//Endpoints
app.post('/server/confidence', ConfidenceController.create);
app.get('/server/confidence', ConfidenceController.read);
app.delete('/server/confidence/:id', ConfidenceController.delete);



//Port Verification
app.listen(port, function(){
  console.log("Listening on port:" + port)
})
