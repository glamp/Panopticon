
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/god', function(req, res) {
  res.render('god', { title: "God Mode", n_users: io.sockets.clients().length });
});
app.get('/user/:name', function(req, res) {
  var user_session_id = req.params.name
    , username = user_session_id;

  res.render("solo-user", { title: "Spying on: " + username, username: username })
});

var server = require('http').createServer(app)

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server, { log: false });

io.sockets.on('connection', function (socket) {

  io.sockets.emit('usercount', io.sockets.clients().length);

  socket.on("setusername", function(username) {
    socket.username = username;
  })

  socket.on("subscribe", function(username) {
    socket.join(username);
  })

  socket.on('screenshot', function(data) {
    io.sockets.emit('observe', data);
    io.sockets.in(data.user).emit('spy', data)
  })

  socket.on('disconnect', function() {
    io.sockets.emit("removeuser", socket.username);
    io.sockets.emit('usercount', io.sockets.clients().length);
  })

});
