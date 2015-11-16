var Devmtn = require('devmtn-auth');
var DevmtnStrategy = Devmtn.Strategy;
var User = require('../models/User.js')

module.exports = {
    authFailure: {failureRedirect: '/'},
    authSuccess: function(req, res) {
        //console.log('req.user:', req.user); // req.user is created by passport from the decoded json web token
        //console.log('user roles:', req.user.roles);
        //console.log('student:', Devmtn.checkRoles(req.user, 'student')) //example of checking user roles

        res.redirect('/#/studentDashboard')
    },
    authLogout: function(req, res) {
        req.logout();
        //console.log(req.user); //just showing req.user is undefined after logout
        res.redirect('/#/logout')
    },
    authLogin: function(jwtoken, user, done) {

        // If roles are blank assume student and auto-populate.
        if (user.roles.length === 0) {
            user.roles = [{role: 'student', id: 6}];
        }

        User.findOne({email: user.email}, function(err, result) {
            if (err) {
                return done(err)
            } else {
                //console.log('findOne', result);
                if (result !== null) {
                    User.findByIdAndUpdate(result._id, {
                        firstName: user.first_name,
                        lastName: user.last_name,
                        devMtn: {
                            id: user.id,
                            roles: user.roles,
                            cohortId: user.cohortId
                        }
                    }, function(err, dbUser) {
                        if (err) {
                            return done(err);
                        } else {
                            //console.log('dbUser-update', dbUser);
                            dbUser.logins.push(new Date());
                            dbUser.save();
                            return done(null, user);
                        }
                    });
                } else {
                    User.create({
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        devMtn: {
                            id: user.id,
                            roles: user.roles,
                            cohortId: user.cohortId
                        }
                    }, function(err, dbUser) {
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
        });
    },
    serializeUser: function(user, done) {
        console.log('serializeUser', user);
        done(null, user.id)
    },
    deserializeUser: function(user, done) {
        //console.log('deserializeUser', user);
        User.findOne({'devMtn.id': user}, function(err, user) {
            if (err) {
                return done(err)
            }
            //console.log(user);
            return done(null, user)
        })
    }
}