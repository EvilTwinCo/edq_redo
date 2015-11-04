Devmtn Auth with passport & json web tokens
-----

This module is a Passport strategy to allow for Devmountain microservice authentication with relatively little configuration. You get all the normal benefits of passport, including auth redirect/callback, req.user and req.logout(), and serializing the user onto the session. Successful authentication will provide a user object with email, user roles, and the unique id from the authentication server database. If your app needs different/more information, it must be configured on Devmountain's app.

Example/recommended server setup [here](./example/server.js).

#### Getting started

Install devmtn-auth:

- Ask a mentor to get a copy of the devmtn-auth module.
- Unzip the devmtn-auth-master folder into the root of your project.
- To install the module and its dependencies:
    - the trailing slash tells npm to install install from a folder, rather than the npm registry

```
    npm install devmtn-auth-master/
```
To make devmtn-auth install with everything else when you run npm install:

```javascript
//Add to package.json

"scripts": {
    "preinstall" : "npm install devmtn-auth-master/"
    }
```

The example has what is basically a [Minimum Setup](./example/server.js).

__Create and/or modify your .gitignore to include devmtnAuthConfig.js__

```javascript
    // in .gitignore
    .DS_Store
    node_modules/
    devmtnAuthConfig.js
    ...
```

Create a devmtnAuthConfig.js to look like this: (specific values will need to be provided to you)

```javascript
    module.exports = {
        app: 'app_name_placeholder',
        client_token: 'client_token_placeholder',
        callbackURL: 'callbackURL_placeholder',
        jwtSecret: 'jwtSecret_placeholder'
    }
```

That's it for setup!

However, for this to work, your app must be configured on the authentication server, and you must be given appropriate config values.

----

The token can be accessed in the verify callback when you set up the strategy

```javascript
    passport.use('devmtn', new DevmtnStrategy(devmtnAuthConfig, function(jwtoken, user, done) {
        //could attach the token to the session for use against devmtn APIs
        req.session.jwtoken = jwtoken;
        User.findOrCreate({email: user.email}, function(err, local_user) {
            return done(err, local_user)
        })
    }))
```

----

For convenience, devmtn-auth exposes a checkRoles function that can be used to verify user roles from the decoded json web token.
```javascript
    //Example
    var Devmtn = require('devmtn-auth');
    Devmtn.checkRoles(req.user, 'student') // returns boolean
```

Running Tests
----

```
npm test
```
