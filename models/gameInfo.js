var mongoose = require("mongoose");

var gameInfoSchema = mongoose.Schema({
	infos: [Object]
});
var GameInfo = mongoose.model("GameInfo", gameInfoSchema);

module.exports = GameInfo;
