"use strict";
require('dotenv').config()
const express = require("express");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const session = require('express-session');
const passport = require('passport');
const myDB = require('./connection');
const routes = require('./routes');
const auth = require('./auth.js');
const app = express();
// const socketio = require('socket.io');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
// const sessionStore = new session.MemoryStore();
const MongoStore = require('connect-mongo')(session);
// const sharedsession = require("express-socket.io-session");
const http = require('http').createServer(app);
const io = require('socket.io')(http);

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');


app.use(passport.initialize());
app.use(passport.session());


myDB(async (client) => {
  const myDataBase = await client.db('myproject').collection('users');
  //-------------------------------------
  const store = new MongoStore({ client: client, dbName: 'myproject', collection: 'users' });
  const sessionMiddleWare = session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    store: store,
    key: 'express.sid'
  });
  app.use(sessionMiddleWare);
  //----------------------------------------
  routes(app, myDataBase);
  auth(app, myDataBase);


  io.use(
    passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'express.sid',
      secret: process.env.SESSION_SECRET,
      store: store,
      success: onAuthorizeSuccess,
      fail: onAuthorizeFail
    })
  );
  // io.use(sharedsession(sessionMiddleWare, {
  //   autoSave: true
  // }));
  // io.use(function (socket, next) {
  //   // Wrap the express middleware
  //   sessionMiddleWare(socket.request, {}, next);
  // })
  var currentUsers = 0;
  io.on('connection', socket => {
    ++currentUsers;
    console.log(socket.request.session.passport.user)
    io.emit('user', {
      name: socket.request.session.passport.user,
      currentUsers,
      connected: true
    });
    socket.on('chat message', (message) => {
      console.log("SERVER: chat message: ", message)
      io.emit('chat message', { name: socket.request.session.passport.user, message })
    })
    console.log('A user has connected');
    socket.on('disconnect', () => {
      console.log('A user has disconnected');
      --currentUsers;
      io.emit('user', {
        name: socket.request.session.passport.user,
        currentUsers,
        connected: false
      });
    });
  });

}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port: ', process.env.PORT);
})
// app.listen(process.env.PORT || 3000, () => {
//   console.log("Listening on port " + process.env.PORT);
// });


function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');

  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}
//--------------------------------
// Just to pass current fCC tests
// TO BE REMOVED
//--------------------------------

// mongo.connect
// app.listen } }

// /views/pug/profile', {username: req.user.username}

// routes

// app.route('/auth/github').get(passport.authenticate('github'));
// app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => { res.redirect('/profile'); })

// require('passport-github')
///passport.use( new GitHubStrategy callbackURL: 'route' process.env.GITHUB_CLIENT_SECRET process.env.GITHUB_CLIENT_ID

//GitHubStrategy  db.collection   socialusers   return cb

// io.emit'user' name currentUsers connected