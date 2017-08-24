/**
 * Module dependencies.
 */
var express = require('express')
,	path = require('path')
,	streams = require('./app/streams.js')();

//change here
// var userService = require('./user_service');
// var f_admin = require("firebase-admin");
// var serviceAccount = require('./novavideo-88f9b-firebase-adminsdk-rgruf-c2dd2186c6.json');
//
// f_admin.initializeApp({
//     credential: f_admin.credential.cert(serviceAccount),
//     databaseURL: 'https://novavideo-88f9b.firebaseio.com'
// });
var firebase = require("firebase");
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
    apiKey: "AIzaSyCKffyYvilqRZN3mlQrnxuCPEJ2ky9r-2M",
    authDomain: "nova-168413.firebaseapp.com",
    databaseURL: "https://nova-168413.firebaseio.com",
    storageBucket: "nova-168413.appspot.com",
};
// var config = {
//     apiKey: "AIzaSyDxeNEydEvAgbcXvLSnJJ0OtSw2_Wp2eF4",
//     authDomain: "novavideo-88f9b.firebaseapp.com",
//     databaseURL: "https://novavideo-88f9b.firebaseio.com",
//     storageBucket: "novavideo-88f9b.appspot.com",
// };
firebase.initializeApp(config);
var database = firebase.database();
//change ends

var favicon = require('serve-favicon')
,	logger = require('morgan')
,	methodOverride = require('method-override')
,	bodyParser = require('body-parser')
,	errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

//login try here
//http://code.runnable.com/VOedxBgEG7oc8eth/login-user-nodejs-express-for-node-js-and-hello-world
app.get('/', function(req, res){
    res.redirect('login');
});

app.get('/login', function(req, res){
    console.log(req.connection.remoteAddress);
    res.render('login');
});

app.post('/login', function(req, res){//req.body.username, req.body.password
    if (req.body.username) {
        console.log('authenticate')
        var userEmail = req.body.username;
        var userPassword = req.body.password;
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
            .then(function(firebaseUser) {
                var user = firebase.auth().currentUser;
                var name, uid;

                if (user != null) {
                    name = user.displayName;
                    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                                     // this value to authenticate with your backend server, if
                                     // you have one. Use User.getToken() instead.
                }
                firebase.database().ref('/doctors/' + uid).once('value') //users
                    .then(function(snapshot) {
                        var snap = snapshot.val();
                        //var username = snapshot.val().username;
                        var firstname=snapshot.val().firstname;
                        var lastname=snapshot.val().lastname;
                        var fullname=firstname+' '+lastname;
                        //res.redirect(uid);
                        res.redirect('signedin/'+fullname+'/'+uid);
                    // ...
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.lcode;
                        var errorMessage = error.message;
                        return res.status(401).send('error');
                    });
                //res.redirect('signedin/'+name+'/'+uid);
                // io.emit('idChange', {
                //     idContent: uid
                // });
                //res.redirect('');

            })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            return res.status(401).send('error');
            // ...
        });


    }
    else {
        console.log('no autenticado')
        req.session.error = 'Authentication failed, please check your '
            + ' username and password.';
        res.redirect('login');
    }
});

// routing
require('./app/routes.js')(app, streams);

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
// var io = require('socket.io')(http, {'pingInterval': 2000, 'pingTimeout': 5000}).listen(server);
/**
 * Socket.io event handling
 */
require('./app/socketHandler.js')(io, streams);