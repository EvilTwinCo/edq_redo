var Confidence = require('../models/Confidence.js');
var Question = require('../models/Question.js');
var Cohort = require('../models/Cohort.js');
var _ = require('underscore');

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
    setCohortSettings:function (socket, next, obj){
      Cohort.findOne({cohortId:obj.cohortId}, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        if (!result){
          Cohort.create(obj, function(err, settings){
            if (err){
              console.log(err);
              return
            }
          });
        }else{
          result = _.extend(result, obj);
          result.save();
        }
      })
    }

}
