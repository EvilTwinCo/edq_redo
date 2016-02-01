var Confidence = require('../models/Confidence.js');
var Question = require('../models/Question.js');

module.exports = {
    getCohortIdOptions: function (req, res) {

        var cohorts = [];
        //Find all cohortIds tied to database confidences.
        Confidence.find({}, function (error, result) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                //console.log(result);
                for (var i = 0; i < result.length; i++) {
                    if (cohorts.indexOf(result[i].cohortId) === -1) {
                        cohorts.push(result[i].cohortId);
                    }
                }
                //console.log(cohorts);

                //Find any cohortIds tied to database questions.
                Question.find({}, function (error, result) {
                    if (error) {
                        console.log(error);
                        res.send(error);
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            if (cohorts.indexOf(result[i].cohortId) === -1) {
                                cohorts.push(result[i].cohortId);
                            }
                        }
                        //console.log(cohorts);
                        res.json(cohorts);
                    }
                })
            }
        })
    },
    getCohortById:function (req, res){}

}
