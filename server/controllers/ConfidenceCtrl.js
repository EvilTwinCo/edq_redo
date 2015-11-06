var User = require('../models/User.js');
var Confidence = require('../models/Confidence.js');

var timeoutQueue = {};
var currentConfidence = {};

module.exports = {
    handleSubmitConfidence: function (socket, io, obj) {
        obj['socketUser'] = socket.client.request.user._doc.devMtn.id;
        //console.log('obj', obj);

        io.to('instructors').emit('report confidence single', obj);

        if (timeoutQueue[obj.objective_id + '|' + obj.socketUser] === undefined) {
            timeoutQueue[obj.objective_id + '|' + obj.socketUser] = new Date();
            setTimeout(recordConfidence.bind(null, {
                learningObjective: obj.objective_id,
                user: obj.socketUser
            }), 10000);
            updateConfidence({
                learningObjective: obj.objective_id,
                user: obj.socketUser,
                confidence: obj.value
            });
            //console.log(timeoutQueue);
        }
        else {
            updateConfidence({
                learningObjective: obj.objective_id,
                user: obj.socketUser,
                confidence: obj.value
            });
        }
    },
    handleInstructorLogin: function (socket, obj) {
        console.log("Instructor Logging In");
        socket.emit("report confidence", currentConfidence);
        socket.join('instructors');
    }
}
    
function updateConfidence(obj) {
    currentConfidence[obj.learningObjective + '|' + obj.user] = obj.confidence;
    //console.log(currentConfidence);
}

function recordConfidence(obj) {
    //console.log(obj.user);
    User.findOne({'devMtn.id': obj.user}, function(err, userResult) {
        if (err) {
            console.log(err);
        } else {            
            Confidence.create({
                learningObjective: obj.learningObjective,
                cohortId: userResult.devMtn.cohortId,
                classId: 'testClassId', //TODO: update once we have an actual classId
                user: userResult._id,
                confidence: currentConfidence[obj.learningObjective + '|' + obj.user],
                timestamp: timeoutQueue[obj.learningObjective + '|' + obj.user]
            }, function (err, confidenceResult) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Learnging objective confidence added to the database: ', confidenceResult);
                }
            })
            
            delete timeoutQueue[obj.learningObjective + '|' + obj.user];
            delete currentConfidence[obj.learningObjective + '|' + obj.user];
        }
    })
    
  
    
}