var User = require('../models/User.js');
var Confidence = require('../models/Confidence.js');

var COHORT_SEPARATOR = '__';
var USER_SEPARATOR = '||';


var timeoutQueue = {};
var currentConfidence = {
// Starting dummy data:
//    '28__123456||1351': '50',
//    '28__123456||1358': '51',
//    '28__123456||1359': '52',
//    '28__123456||1350': '53',
//    '27__123456||1356': '34',
//    '27__123456||1358': '85',
//    '26__123456||1354': '46',
//    '26__123456||1355': '47',
//    '28__12345X||1351': '80',
//    '28__12345X||1358': '71',
//    '28__12345X||1359': '62',
//    '28__12345X||1350': '53',
//    '27__12345X||1356': '44',
//    '27__12345X||1358': '35',
//    '26__12345X||1354': '26',
//    '26__12345X||1355': '17'
};

module.exports = {
    handleSubmitConfidence: function (socket, io, obj) {
        obj.devMtnId = socket.request.user.devMtn.id;
        obj.cohortId = socket.request.user.devMtn.cohortId;
        
        if (timeoutQueue[obj.cohortId + COHORT_SEPARATOR + obj.objective_topic + USER_SEPARATOR + obj.devMtnId] === undefined) {
            timeoutQueue[obj.cohortId + COHORT_SEPARATOR + obj.objective_topic + USER_SEPARATOR + obj.devMtnId] = new Date();
            setTimeout(recordConfidence.bind(null, {
                objective_id: obj.objective_id,
                devMtnId: obj.devMtnId,
                cohortId: obj.cohortId,
                objective_topic: obj.objective_topic,
                objective_name: obj.objective_name
            }), 10000);
        }
        
        updateConfidence({
            objective_id: obj.objective_id,
            devMtnId: obj.devMtnId,
            cohortId: obj.cohortId,
            value: obj.value,
            objective_topic: obj.objective_topic,
            objective_name: obj.objective_name
        });

        //console.log(obj);
        io.to('instructors').emit('report confidence single', obj);
    },
    handleGetCurrentConfidences: function (socket, cohortId) {
        var filterObj = {};
        var returnObj = {};
        for (var prop in currentConfidence) {
            if (prop.search(cohortId + COHORT_SEPARATOR) !== -1) {
                filterObj[prop] = currentConfidence[prop];
            }
        }
        //console.log(filterObj);
        for (var prop in filterObj) {
            var indexStart = prop.indexOf(COHORT_SEPARATOR);
            var indexStop = prop.indexOf(USER_SEPARATOR);
            var objTopic = prop.slice(indexStart + COHORT_SEPARATOR.length, indexStop);
            var cohortId = prop.slice(0,indexStart);
            var userId = prop.slice(indexStop + USER_SEPARATOR.length);
            socket.emit('report confidence single', {
                objective_topic: objTopic,
                value: String(filterObj[prop]),
                devMtnId: userId,
                cohortId: cohortId,
            });  
        }
    },
    getDatabaseConfidences: function (req, res) {
        var findObj;
        if (req.params.cohortId === 'all') findObj = {};
        else findObj = {cohortId: req.params.cohortId};
        //console.log('findObj', findObj);
        
        Confidence.find(findObj).populate({
                path: 'user',
                select: 'firstName lastName',
            }).sort({timestamp: -1}).exec(function (error, result) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                res.json(result);
            }
        })
    },
    getUserLearningObjConfidences: function (req, res) {
        var findObj;
        
        if (req.params.userId) {
            if (req.params.learningObjId !== undefined) {
                findObj = {
                    user: req.params.userId,
                    learningObjective: req.params.learningObjId
                }   
            } 
            else findObj = {user: req.params.userId};
            //console.log('findObj', findObj);

            Confidence.find(findObj).populate({
                path: 'user',
                select: 'firstName lastName',
            }).sort({timestamp: -1}).exec(function (error, result) {
                if (error) {
                    console.log(error);
                    res.send(error);
                } else {
                    res.json(result);
                }
            })
        }
    }
}
    
function updateConfidence(obj) {
    currentConfidence[obj.cohortId + COHORT_SEPARATOR + obj.objective_topic + USER_SEPARATOR + obj.devMtnId] = obj.value;
}

function recordConfidence(obj) {
    User.findOne({'devMtn.id': obj.devMtnId}, function(err, userResult) {
        if (err) {
            console.log(err);
        } else {            
            Confidence.create({
                learningObjective: obj.objective_id,
                learningObjectiveTopic: obj.objective_topic,
                learningObjectiveName: obj.objective_name,
                cohortId: obj.cohortId,
                classId: 'testClassId', //TODO: update once we have an actual classId
                user: userResult._id,
                confidence: currentConfidence[obj.cohortId + COHORT_SEPARATOR + obj.objective_topic + USER_SEPARATOR + obj.devMtnId],
                timestamp: timeoutQueue[obj.cohortId + COHORT_SEPARATOR + obj.objective_topic + USER_SEPARATOR + obj.devMtnId],

            }, function (err, confidenceResult) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log('Learning objective confidence added to the database: ', confidenceResult);
                }
            })
            
            delete timeoutQueue[obj.cohortId + COHORT_SEPARATOR + obj.objective_topic + USER_SEPARATOR + obj.devMtnId];
        }
    })
}

//TODO: Make this a reset at midnight instead of a reset every 24 hours.
setInterval(function(){
    //console.log('clearing current confidence cache');
    currentConfidence = {};
}, 1000 * 60 * 60 * 24);