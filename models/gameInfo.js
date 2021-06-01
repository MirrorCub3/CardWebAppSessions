var mongoose = require("mongoose");
const Player = require("../Player.js");
const Deck = require("../cards.js");

var gameInfoSchema = mongoose.Schema({
	ident: {
		required: true,
		unique: true,
		type:Number
	},
	player: [Object],
  deck:Object,
});

var GameInfo = mongoose.model("GameInfo", gameInfoSchema);

module.exports = GameInfo;
