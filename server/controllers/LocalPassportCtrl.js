var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;
var _ = require('underscore');

var User = require('../models/User.js');

var fakeUsers = [
    {
        "email" : "test1@test.com",
        "firstName" : "Matt",
        "lastName" : "Mars",
        "devMtn" : {
        "cohortId" : "28",
        "roles" : [ 
            {
                "id" : 6,
                "role" : "student"
            }
        ],
        "id" : "0001"
        }
    },
    {
        "email" : "test2@test.com",
        "firstName" : "Sam",
        "lastName" : "Smith",
        "devMtn" : {
            "cohortId" : "27",
            "roles" : [ 
                {
                    "id" : 6,
                    "role" : "student"
                }
            ],
            "id" : "0002"
        }
    },
    {
        "email" : "test3@test.com",
        "firstName" : "Marky",
        "lastName" : "Mark",
        "devMtn" : {
            "cohortId" : "28",
            "roles" : [ 
                {
                    "id" : 6,
                    "role" : "student"
                }
            ],
            "id" : "0003"
        }
    },
    {
        "email" : "test4@test.com",
        "firstName" : "Frodo",
        "lastName" : "Baggins",
        "devMtn" : {
            "cohortId" : "26",
            "roles" : [ 
                {
                    "id" : 6,
                    "role" : "student"
                }
            ],
            "id" : "0004"
        }
    },
    {
        "email" : "test5@test.com",
        "firstName" : "Leah",
        "lastName" : "Princess",
        "devMtn" : {
            "cohortId" : "28",
            "roles" : [ 
                {
                    "id" : 6,
                    "role" : "student"
                }
            ],
            "id" : "0005"
        }
    },
]

module.exports = {
    setup: passport.use(new PassportLocalStrategy(
        function (username, password, done) {
            var user = _.findWhere(fakeUsers, {email: username});
            //return done(null, _.findWhere(fakeUsers, {email: username}));
            
            User.findOne({email: user.email}, function(err, result) {
                if (err) {
                    return done(err)
                } else {
                    if (result !== null) {
                        return done(null, user);
                    } else {
                        User.create(user, function(err, dbUser) {
                            if (err) {
                                return done(err)
                            } else {
                                //console.log('dbUser-create', dbUser);
                                dbUser.logins.push(new Date());
                                dbUser.save();
                                return done(null, user)
                            }
                        });
                    }
                }
            })
        }
    )),
    auth: passport.authenticate('local', {
        successRedirect: '/auth/passportLocal/setUser',
        failureRedirect: '/auth/passportLocal/setUser'
    }),
    setUser: function (req, res) {
        if (req.user) {
            console.log(req.user);
            res.json('true');
        }
        else {
            res.send('false');
        }
    }
}



