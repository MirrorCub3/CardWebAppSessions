var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");


var setUpPassport = require("./setuppassport");
var routes = require("./routes"); // sesion request handlers
var routesData = require("./routesData");    //added // student information request handlers
var routesGame = require("./routesGame");
var app = express();
mongoose.connect("mongodb://localhost:27017/cardApp", {useMongoClient:true});   //27017 seems to be the port number used by mongod
setUpPassport();

app.set("port", process.env.PORT || 4005);

app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(routesData);
app.use(routesGame);

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
