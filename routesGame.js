var path = require("path");
var express = require("express");
var passport = require("passport");

var User = require("./models/user");
const UserJS = require('./user');
//const GameInfo = require('./models/gameInfo');
const GameInfoJS = require('./gameInfo');

const GameSettings = require('./models/gameSettings');
const GameSettingsJS = require('./gameSettings');

const Deck = require("./cards.js");
const Player = require("./Player.js");
var allGameInfos = [];
var allUserPlayerInfo = [];

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
function initGameIdent(){
  // two function pointers: if the code works good, then it runs resolve, the identbook changing code below.
// if there is a problem, then we use the reject function call
  return new Promise(function(resolve,reject) { // an instance of a promise, putting the code we want to happen first inside that promise
		if (gameIdent == 0) {
			GameSettings.find({},function(err,game) { // without promise this allback will be called too late
				console.log("BookModel.find()");
				if (err) {
					reject(err); // reject if bad
				}
				else {
          console.log("existing games");
          let objs = [];
          for (let i=0;i<game.length;i++) {
            if (gameIdent < game[i].ident)
              gameIdent = game[i].ident;
          }
					resolve(gameIdent); // calls the resove function with  the new identbook
				}
			});
		}
    else {
			resolve(gameIdent); // calls the resove function with  the new identbook
		}
	});
}
// function initGameIdent(){ // check everytime a ident is gotten to update it to the largest value
//   if (gameIdent == 0)
//   {
//     GameSettings.find({},function(err,game) { // doe a find and lookss through all users ids
//       if (!err) {
//         console.log("existing games");
//         let objs = [];
//         for (let i=0;i<game.length;i++) {
//           if (gameIdent < game[i].ident)
//             gameIdent = game[i].ident;
//         }
//         console.log("in it game ident " + gameIdent);
//       }
//     });
//   }
// }

router.get("/drawcard",function(req,res) {
  console.log("draw");
  let myInfo = findGameInfo(req.body.gameIdent);
    if(myInfo.deck.CheckEmpty()){
        res.json(null);
        return;
    }
  let handDB = null;
    for (let index of myInfo.players) {
        if(myInfo.players[index] = req.user.ident){
              handDB= myInfo.players[index];
        }
    }
    let cards = [];
    for(let x = 0; x < req.body.num;x++){
        cards[cards.length] = myInfo.deck.Draw(); //calling a method in the cards.js class
    }
    for(let card in cards){
        if(cards[card] == null){
            cards.splice(card, 1); // removing null cards
        }
        let myHand = handDB.hand;
        myHand.hand[myHand.hand.length] = cards[card];
    }
    res.json({cards:handDB.hand});
});

router.get("/getGameList", function(req,res,next){
  return(db.getGameList(res));
//	return(db.getStudent(req.user.ident,res));
});
router.get("/getGame", function(req, res) {
console.log("get game");
    if (req.isAuthenticated()) {
        return(db.getGame(req.query.ident,res));
    }
});
// router.get("/getGameInfo", function(req, res) {
// console.log("get gameinfo");
//     if (req.isAuthenticated()) {
//         //code here to loop through all info and find the game
//     }
// });

router.post("/creategame", function(req, res) {
  //console.log(req);
console.log("post creategame");
  var Prom1 = initGameIdent();
  Prom1.then(
    function(result) { // the good function
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
    },
    function(err) { // the reject function
        console.log("error");
        res.json({retVal:null});
    }
  );
});

router.post("/creategameinfo", function(req, res) {
console.log("post gameinfo");
    if (req.isAuthenticated()) {
      let deck = new Deck(req.body.replace,req.body.jokers);
      deck.shuffle();

      let players = [];
      players.length = req.body.playerNum;
      players[0] = new Player(req.user.ident, req.user.username,req.body.ident);
      let info = new GameInfoJS(
        req.body.ident,
        req.body.playerNum,
        players,
        deck
      );
      allGameInfos.push(info);
      console.log(allGameInfos[0].deck);
      console.log(allUserPlayerInfo);
      //return(db.postGameInfo(allGameInfos,res));
      return res.json({retVal:true});
    }
    return res.json({retVal:false});
});
router.get("/successplayer", function(req, res) {
console.log("get successplayer");
	res.json({redirect:"/player"});
});
router.get("/failplayer", function(req, res) {
console.log("get failplayer");
	res.json({redirect:"/login"});
});

router.post("/postPlayer", function(req, res) {
console.log("post postPlayer");
if (req.isAuthenticated()) {
if(existingPlayer(req.user.ident) == false){
  ////check if this is player 1
  for (let i = 0; i < allGameInfos.length; i++) {
    if(allGameInfos[i].full){
        return res.redirect("/successjoin");
        return;
    }
      if(allGameInfos[i].ident == req.body.gameIdent){
          if(allGameInfos[i].players[0].name == req.user.username){
            console.log("player one post");
            console.log(allGameInfos[i].players);
            let obj = new UserJS(req.user.ident, req.user.username,req.body.gameIdent);
            allUserPlayerInfo.push(obj);
            return res.redirect("/successplayer");
            break;
          }
          else{
            console.log("bacic player post request");
            let activecount = 0;
            for (let y = 0; y <  allGameInfos[i].players.length; y++) {
              if(allGameInfos[i].players[y] && allGameInfos[i].players[y].ident == req.user.ident){
                  console.log("player is in game");
                  return res.redirect("/successjoin");
                  break;
              }
              if(!allGameInfos[i].players[y]){
                allGameInfos[i].players[y] = new Player(req.user.ident, req.user.username,req.body.gameIdent);
                console.log(allGameInfos[i].players[y]);
                break;
              }
              else{
                activecount++;
              }
            }
            if(activecount >= allGameInfos[i].playerNum){
              console.log("too many players");
              allGameInfos[i].full = true;
              return res.redirect("/successjoin");
            }
              let obj = new UserJS(req.user.ident, req.user.username,req.body.gameIdent);
              allUserPlayerInfo.push(obj);
            console.log(allUserPlayerInfo);
            console.log(allGameInfos[i].players);
            return res.redirect("/successplayer");
          }
        //  console.log(allGameInfos[i].players);
        break;
      }
    }
}
console.log("none of the above");
return res.redirect("/successjoin");
}
else {
return res.redirect("/failplayer");
}
});
router.get("/player", function (req,res){
  console.log("get player");
  if (req.isAuthenticated()) {
    console.log("success get player");
    for (let i = 0; i < allGameInfos.length; i++) {
        if(allGameInfos[i].players[0].name == req.user.username ){
          console.log("send player 1 html");
          let thePath = path.resolve(__dirname,"public/views/playerone.html");
          res.sendFile(thePath);
          return;
        }
      }
      if(findPlayerGame(req.user.ident) > 0){
          console.log("send player basic html");
          let thePath = path.resolve(__dirname,"public/views/player.html");
          res.sendFile(thePath);
      }
      else{
        console.log("not a player");
        let thePath = path.resolve(__dirname,"public/views/join.html");
        res.sendFile(thePath);
      }
  }
  else {
    console.log("fail get create");
    let thePath = path.resolve(__dirname,"public/views/login.html");
    res.sendFile(thePath);
  }
});

function existingPlayer(ident){
  console.log("in existing player");
  for (let i = 0; i < allUserPlayerInfo.length; i++) {
    if(allUserPlayerInfo[i].ident == ident){
      console.log("players matching idents");
      return true;
    }
  }
  return false;
}

function findPlayerGame(ident){
  console.log(ident);
  console.log("in find player game ident");
  for (let i = 0; i < allUserPlayerInfo.length; i++) {
    if(allUserPlayerInfo[i].ident == ident){
      console.log('game ident match');
      return (allUserPlayerInfo[i].gameIdent);
    }
  }
  return (0);
}
function findGameInfo(ident){
  console.log('getting info');
  for (let i = 0; i < allGameInfos.length; i++) {
    if(allGameInfos[i].ident == ident)
    console.log(allGameInfos[i]);
    return (allGameInfos[i]);
  }
  return null;
}

router.get("/findPlayerNum", function (req,res){
    console.log("finding player game number");
    if (req.isAuthenticated()) {
      return res.json({gameIdent: findPlayerGame(req.user.ident)});
    }
    return res.redirect("/failplayer");
});


module.exports = router;
