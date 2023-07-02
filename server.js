const express               = require('express'),
      app                   = express(),
      server                = require('http').Server(app),
      io                    = require('socket.io')(server),
      { ExpressPeerServer } = require('peer'),
      peerServer            = ExpressPeerServer(server , {debug: true}), 
      mongoose              = require("mongoose"),
      LocalStrategy         = require("passport-local"),
      bodyParser            = require("body-parser"),
      passportLocalMongoose = require("passport-local-mongoose"),
      expressSanitizer      = require("express-sanitizer"),
      Room                  = require("./models/room-model"),
      User                  = require("./models/user"),
      Chat                  = require("./models/chat"),
      catchAsync            = require('./utils/catchAsync'),
      passport              = require('passport'),
      flash                 = require('connect-flash'),
      {v4 : uuidv4}         = require('uuid'),
      auth_routes           = require('./routes/auth_routes'),
      room_routes           = require('./routes/room_routes');

mongoose.connect("mongodb+srv://Vishu_0410:Vishal@2001@vishu0410.tqftuxi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",  {
      useNewUrlParser: true,
      useUnifiedTopology: true
      }).then(() => console.log('Connected to DB!'))
        .catch(error => console.log(error.message));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(flash());
app.use(require("express-session")({
      secret: "Teams-Clone-App",
      resave: false,
      saveUninitialized: false
      }));
app.use(function(req, res, next){
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      next();
      });

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.use('/peerjs' , peerServer);


app.get('/', function(req,res){
  var flag=0;
  var username="Guest-User"
  if(req.user){
    flag=1;
    username=req.user.username;
  }
  var id=uuidv4();
 res.render('index',{flag,username,id});
})
app.use('/', auth_routes);
app.use('/', room_routes);


io.on('connection' , socket=>{
  socket.on('join-room' , (roomId , userId)=>{
    console.log("joined room");
    socket.join(roomId);
    socket.to(roomId).emit('user-connected' , userId);

    socket.on('message' ,data=>{
          Room.findById(roomId, function(err, room){
            if(err){
                console.log(err);
                res.redirect("/room"+req.params.id);
                } else {
                      Chat.create({text: data.message}, function(err, chat){
                          if(err){
                              console.log(err);
                            } else {
                                chat.author.id = data.user_id;
                                chat.author.username = data.username;
                                chat.save();
                                room.chats.push(chat);
                                room.save().then(()=>{
                                  io.to(roomId).emit('createMessage', data)
                                })
                            } 
                      });
                  }
          });
    })

    socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
      })

    socket.on('drawn',(data)=> {
        socket.to(roomId).emit('will_draw', data)
      })
   
    socket.on('clear_wb', ()=>{
        socket.to(roomId).emit('clear_wb')
      })

  })
})



server.listen(process.env.PORT||3030,()=>{
  console.log("Server listening on port 3030");
});
 
