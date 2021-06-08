var path = require("path");
var express = require("express");
var passport = require("passport");

var User = require("./models/user");
const GameInfo = require('./models/gameInfo');
const GameInfoJS = require('./gameInfo');

const GameSettings = require('./models/gameSettings');
const GameSettingsJS = require('./gameSettings');

var router = express.Router();
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

//function ensureAuthenticated(req, res, next) {
//  if (req.isAuthenticated()) {
//    next();
//  } else {
//    req.flash("info", "You must be logged in to see this page.");
//    res.redirect("/login");
//  }
//}

router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});


//added below for mongo
const myDatabaseGame = require('./myDatabaseGame');
//added above for mongo

let db = new myDatabaseGame();

var gameIdent = 0;

function initGameIdent(){ // check everytime a ident is gotten to update it to the largest value
  if (gameIdent == 0)
  {
    GameSettings.find({},function(err,game) { // doe a find and lookss through all users ids
      if (!err) {
        let objs = [];
        for (let i=0;i<game.length;i++) {
          if (gameIdent < game[i].ident)
            gameIdent = game[i].ident;
        }
        console.log("in it game ident " + gameIdent);
      }
    });
//    ident = 3;   //this was temp to check if User.find above is an issue.
  }
}

router.post("/creategame", function(req, res) {
  //console.log(req);
  initGameIdent();
console.log("post creategame");

  gameIdent++; // plus one to ident = notice how the id is already ++ even though it hasn't passes the find null check yet - try moving this below the return line and see if it causes issues

  var newGame = new GameSettingsJS(
    gameIdent,
    req.body.hostName,
    req.body.name,
    req.body.players,
    req.body.gameActive,
    req.body.private,
  	req.body.password,

    req.body.dealAll,
    req.body.startHand,
  	req.body.jokers,
  	req.body.infinite,
  	req.body.replace,
  );
console.log(newGame);
return(db.postGame(newGame,res));
});

router.get("/getGame", function(req, res) {
console.log("get game");
    if (req.isAuthenticated()) {
        return(db.getGame(req.query.ident,res));
    }
});
router.post("/creategameinfo", function(req, res) {
console.log("post gameinfo");
    if (req.isAuthenticated()) {
      var info = new GameInfoJS(
        req.body.ident,
        req.body.playerNum,
        req.body.players,
        req.body.deck
      );
      console.log(info);
      return(db.postGameInfo(info,res));
    }
});
router.post("/player", function(req, res) {
console.log("post player");
    if (req.isAuthenticated()) {
        //if()
    }
    else {
    return res.redirect("/faillogin");
    }
});

module.exports = router;
