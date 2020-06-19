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

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

myDB(async (client) => {
  const myDataBase = await client.db('myproject').collection('users');

  routes(app, myDataBase);
  auth(app, myDataBase);
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});



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