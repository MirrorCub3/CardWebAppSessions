var mongoose = require("mongoose");

var gameSettingSchema = mongoose.Schema({
	ident: {
		required: true,
		unique: true,
		type:Number
	},
	host: String,
	name: String,
	players: Number,
	gameActive: Boolean,
	private:Boolean,
	password: String,

  dealAll: Boolean,
  startHand: Number,
	jokers:Boolean,
	infinite:Boolean,
	replaceShuffle: Boolean,

});

var GameSettings = mongoose.model("GameSettings", gameSettingSchema);

module.exports = GameSettings;
