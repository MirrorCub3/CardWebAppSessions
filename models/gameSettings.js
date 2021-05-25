var mongoose = require("mongoose");

var gameSettingSchema = mongoose.Schema({
	ident: {
		required: true,
		unique: true,
		type:Number
	},
	name: String,
	host: String,
	players: Number,

  dealAll: Boolean,
  startHand: Number,

  gameActive: Boolean,

});

var GameSettings = mongoose.model("GameSettings", gameSettingSchema);

module.exports = GameSettings;
