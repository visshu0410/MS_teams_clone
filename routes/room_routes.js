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
      Chat                  = require("../models/chat"),
      catchAsync            = require('../utils/catchAsync'),
      passport              = require('passport');
      const flash           = require('connect-flash');
      const {v4 : uuidv4}   = require('uuid');

      
//Route for creating a new room
  
    router.post('/new-room',function(req,res){
      var name = req.body.name;
      var formData = {title: name};
        Room.create(formData, function(err, newRoom){                                          //Using the input of the form at home.ejs to create an empty room
          if(err){
              res.render("/");
          } else {
              res.redirect("/room/"+newRoom._id);
          }
        });
      })
    
//Route for viewing all past rooms
    router.get('/my-rooms',isLoggedIn, (req, res) => {
      var m=req.user;
       User.findById(m._id).populate("rooms").exec(function(err,me){
        if(err){
          console.log(err);
          res.redirect('/');
        }else{
          res.render('all-rooms', { me:me })
        }
      })
    });

//Route for viewing chat of specific room and all past rooms alonside it
    router.get('/room/:room' ,isLoggedIn, function(req, res){
      var id = req.params.room;
      Room.findById(req.params.room).populate("chats").populate("attendees").exec(function(err, room){         //Find the room by room ID
          if(err){
            console.log(err);
              res.redirect("/");
          } else {
            var attendees=req.user;
            var i=attendees._id;
            var flag=0;

            room.attendees.forEach(function(id){                                          //To find if the current user is already in the attendees list of room or not, if not then add it
              if(i==id._id){
                flag=1;
              }
            })

            if(flag==0){                                                                  //if not then add it
                room.attendees.push(attendees);
                room.save();
            }

            User.findById(i,function(err,p){                                             //Find the data of current user
              if(err){
                console.log(err);
                res.redirect("room"+req.params.id)
              }else{
                var sa=0;
                p.rooms.forEach(function(rm){                                           //To check if the current room is a part of past rooms of the uswer or not, if not, then add it
                  if(rm._id==room.id){
                    sa=1;
                  }
                })
                if(sa==0){
                p.rooms.push(room);                                                     //if not, then add it
                p.save();
                }
              }
            })
        
            var m=req.user;
            User.findById(m._id).populate("rooms").exec(function(err,me){               //Find all the past rooms of the user
              if(err){
                console.log(err);
                res.redirect('/');
              }else{
                    res.render("chat-room", {room: room  , me});
              }
            })
      
          }
      });
    })
    
//Route for POST when the announcement message is sent from the form in chat-room.ejs, this will create a chat data and also link it with the room it was sent in    
    router.post("/room/:id",isLoggedIn,function(req, res){
        Room.findById(req.params.id, function(err, room){                             //Searching the room we are currently in to add the chat object
            if(err){
                console.log(err);
                res.redirect("/room"+req.params.id);
            } else {
            Chat.create({text: req.body.text}, function(err, chat){                    //Create a chat object using text value recieved from form
                if(err){
                    console.log(err);
                } else {
                  chat.author.id = req.user._id;
                  chat.author.username = req.user.username;
                  chat.save();
                  room.chats.push(chat);
                  room.save();
                  res.redirect('/room/' + room._id);                                   //Redirect again to the same chat-room
                }
            });
            }
        });
      });

//Route for the vide call      
    var user_c={};                                                                     //Creating an user_c to store the data of current user
    router.get('/:room' , function(req, res){
      if(req.user){                                                                                                         
        user_c =req.user;                                                              //if user is registered, user his username as user_c.username and same for id
      }else{
        user_c={
          username:"guest-user",                                                        //if the user is not registered, assign his username as guest-user and similarly for id
          _id:"60e999b4503f63361cc378dd"
        }
      }
      res.render('room' , { roomId:req.params.room , user_c: user_c });
    })
    
//Middleware function for restricting pages to only signed in users    
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.session.returnTo = req.originalUrl
        res.redirect("/login");
      }
   
      
module.exports = router;                                                                              //Exporting the js file