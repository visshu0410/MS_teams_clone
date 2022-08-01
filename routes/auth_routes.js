//Importing the modules,files etc. for use
const express = require('express'),
      router     = express.Router();
      const mongoose        = require("mongoose"),
      LocalStrategy         = require("passport-local"),
      bodyParser            = require("body-parser"),
      passportLocalMongoose = require("passport-local-mongoose"),
      expressSanitizer      = require("express-sanitizer"),
      Room                  = require("../models/room-model"),
      User                  = require("../models/user"),
      Chat               = require("../models/chat"),
      catchAsync = require('../utils/catchAsync'),
      passport              = require('passport');
      const flash = require('connect-flash');
      const {v4 : uuidv4} = require('uuid');

//Routes for authentication

//Routes for registering user
      router.get("/register", function(req, res){
        res.render("register");
      });

      router.post('/register', catchAsync(async (req, res, next) => {
        try {
              const { email, username, password } = req.body;
              const user = new User({ email, username });
              const registeredUser = await User.register(user, password);                   //Registering new user using passport
              req.login(registeredUser, err => {                                            //Logging in the user on successfull registration 
                  if (err) return next(err);
                  req.flash('success', 'Welcome!');
                  res.redirect('/');
              })
          }catch (e) {
            req.flash('error', e.message);
            res.redirect('register');
            }
      }));
  
//Routes for logging in user
      router.get('/login', (req, res) => {
        res.render('login');
      })
      
      router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {  //Authenticating the user with input credentials using passport
        req.flash('success', 'welcome back!');
        const redirectUrl = req.session.returnTo || '/';                                   //If a user was redirected to the login page due to the isLoggedIn middleware, then store that to redirect user back to the page it was, else redirect to home page
        delete req.session.returnTo;
        res.redirect(redirectUrl);
      })
  
//Route for Logging user out
      router.get('/logout', (req, res) => {                                                  //LogOut the user
          req.logout();
          req.flash('success', "Goodbye!");
          console.log("logged out")
          res.redirect('/');
        })
  

  
      module.exports = router;  