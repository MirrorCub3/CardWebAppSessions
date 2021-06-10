const Player = require("./Player.js");
const Deck = require("./cards.js");

let GameInfoJS = function(ident,playerNum = 1, players = [], deck = new Deck()) {
	this.ident = ident;
  this.playerNum = playerNum;
	this.players = players;
  this.deck = deck;
}
CutExtraPlayers(){
}

module.exports = GameInfoJS;
