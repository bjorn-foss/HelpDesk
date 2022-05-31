const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(urlencodedParser);


//cookies + sessions
const pass = require('./config/passport');

const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const session = require("express-session");
const sessionMiddleware = session({ secret: "changeit", resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());


//socket
const http = require('http');//.server(app);
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connect', (socket) => {
    console.log('someone connected' + socket.id);
    socket.on("message", (data)=>{
        socket.broadcast.emit("message-recive", (data));
    })
});

//routes
app.use('/', require('./config/routes'));


server.listen(port, function () {
    console.log(`App running at: http://localhost:${port}`);
 });


/*const server = app.listen(port, function () {
    console.log(`App running at: http://localhost:${port}`);
});*/
