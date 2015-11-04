var express = require('express');
var session = require('express-session');
var port = 8000;
var bodyParser = require('body-parser');
var passport = require('passport');
var Devmtn = require('devmtn-auth');
var DevmtnStrategy = Devmtn.Strategy;
var devmtnAuthConfig = require('./devmtnAuthConfig.js')

var app = express();

// Morgan is not required, but nice for development
var morgan = require('morgan');
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'Dallindoesntlikemychoiceofsecrets',
  resave: true,
  saveUninitialized: false
}))
app.use(express.static(__dirname + '/public'));

//-----------------passport setup----------------

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  // This should match your data (e.g. would be user._id for mongo/mongoose)
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {

  User.findById(id, function(err, user) {
    if (err) {
      return done(err)
    }
    return done(null, user)
  })

})

passport.use('devmtn', new DevmtnStrategy(devmtnAuthConfig, function(jwtoken, user, done) {
  // Find or create a user in your database here and return your user.
  // json web token is also provided here as jwtoken and could be added to the session for use on API calls to devmounta.in

  User.findOrCreate({email: user.email}, function(err, local_user) {
    return done(err, local_user)
  })

}))

//-----------------end passport setup----------

//------------------auth endpoints-------------

app.get('/auth/devmtn', passport.authenticate('devmtn'), function(req, res) {
  // redirects, so this doesn't get called
})

// failureRedirect and res.redirect should be changed to match your app
app.get('/auth/devmtn/callback', passport.authenticate('devmtn', {failureRedirect: '/#/login'}),
  function(req, res) {
    //successful authentication

    console.log(req.user); // req.user is created by passport from the decoded json web token
    console.log('user roles:', req.user.roles);
    console.log('student:', Devmtn.checkRoles(req.user, 'student')) //example of checking user roles

    res.redirect('/#/dashboard')
  });

app.get('/auth/devmtn/logout', function(req, res) {
  req.logout();
  console.log(req.user); //just showing req.user is undefined after logout
  res.redirect('/#/')
})

//--------------end auth endpoints ------------


// Start server
app.listen(port, function() {
  console.log('listening on port ' + port);
})
