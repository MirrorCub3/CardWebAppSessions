var mongoose = require("mongoose");
const Player = require("./playerObject.js");
const Deck = require("./cards.js");

var gameInfoSchema = mongoose.Schema({
	ident: {
		required: true,
		unique: true,
		type:Number
	},
	player: [Player],
  deck:Deck,
});

var GameInfo = mongoose.model("GameInfo", gameInfoSchema);

module.exports = GameInfo;
