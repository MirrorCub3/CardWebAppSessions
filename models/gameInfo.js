var mongoose = require("mongoose");
const Player = require("../Player.js");
const Deck = require("../cards.js");

var gameInfoSchema = mongoose.Schema({
	ident: {
		required: true,
		unique: true,
		type:Number
	},
	playerNum: Number,
	players: {
		type:[Object],
		validate: [playerLimit, '{PATH} exceeds the limit of players']
	},
  deck:Object,
});

function playerLimit(val) {
  return val.length < playerNum;
}
var GameInfo = mongoose.model("GameInfo", gameInfoSchema);

module.exports = GameInfo;
