

var express = require("express");
var mongoose = require("mongoose");
const GameInfo = require('./models/gameInfo');
const GameSettings = require('./models/gameSettings');
const UserJS = require('./user');
const User = require("./models/user");

let myDatabaseGame = function() {
}

myDatabaseGame.prototype.postGame = function(game,res) {
  console.log(" host name = " + game.hostName);
    GameSettings.create(game,function(error,info) { // this mongoose call will create the student document in the infos collection
        if (error) {
            return res.json({retVal:false});
        }
        return res.json({retVal:true});
    });
}

module.exports = myDatabaseGame;
