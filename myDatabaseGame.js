

var express = require("express");
var mongoose = require("mongoose");
const GameInfo = require('./models/gameInfo');

const GameSettings = require('./models/gameSettings');
const GameSettingsJS = require('./gameSettings');

const User = require("./models/user");
const UserJS = require('./user');

let myDatabaseGame = function() {
}

myDatabaseGame.prototype.postGame = function(game,res) {
  console.log(" host name = " + game.ident);
    GameSettings.create(game,function(error,info) {
        if (error) {
            return res.json({retVal:false});
        }
        console.log("database post game, info ident "+ info.ident);
        return res.json({retVal:true,ident:info.ident});
    });
}
// myDatabaseGame.prototype.postGameInfo = function(gameInfo,res) {
//   console.log("in post game info database");
//   console.log(gameInfo);
//     GameInfo.create(gameInfo,function(error,info) {
//         if (error) {
//           console.log("error create info");
//             return res.json({retVal:false});
//         }
//         console.log("added info");
//         return res.json({retVal:true});
//     });
// }
myDatabase.prototype.updateUser = function(user,res) { // geting the stuent info - called on document.ready and in the read function on student sessions and admin
  User.findOneAndUpdate({ident:user.ident},{playing:user.playing},function(error,olduser) { //doing a find on the students id - the unique identifier
    if (error) {
      return res.json({retVal:false});
    }
    else if (olduser == null) {
      return res.json({retVal:false});
    }
    return res.json({retVal:true});
  });

}
myDatabaseGame.prototype.getGame = function(ident,res) {
  console.log(" game ident = " + ident);
  GameSettings.find({ident:ident},function(error,info) { //doing a find on the students id - the unique identifier
      if (error) {
          return res.json({retVal:null});
      }
      else if (info == null) {
          return res.json({retVal:null});
      }

      if (info.length == 1)
      {
        return res.json({ retVal: true, game: new GameSettingsJS(ident, info[0].host, info[0].name, info[0].players, info[0].gameActive, info[0].private,info[0].password, info[0].dealAll, info[0].startHand, info[0].jokers, info[0].infinite, info[0].replaceShuffle)});
      }
      else
          return res.json({retVal:null});

   });
}
myDatabaseGame.prototype.getGameList = function(res) {
  GameSettings.find({},function(error,info) { //doing a find on the students id - the unique identifier
      if (error) {
          return res.json({retVal:null});
      }
      else if (info == null) {
          return res.json({retVal:null});
      }

      if (info.length >= 1)
      {
        return res.json({ retVal: true, info: info});
      }
      else
          return res.json({retVal:null});

   });
}
// myDatabaseGame.prototype.getGameInfo = function(res) {
//   GameInfo.find({},function(error,info) { //doing a find on the students id - the unique identifier
//       if (error) {
//         console.log("error finding info");
//           return res.json({retVal:null});
//       }
//       else if (info == null) {
//         console.log("no info");
//           return res.json({retVal:null});
//       }
//       console.log("database found info");
//       return res.json({ retVal: true, info: info});
//
//
//    });
// }

module.exports = myDatabaseGame;
