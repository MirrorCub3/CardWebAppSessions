let GameSettingsJS = function(ident,host = "",name = "Virtual Cards", players = 1, gameActive = true, private = false, password = "", dealAll = false, startHand = 0, jokers = false, infinite = false, replaceShuffle = false) {
	this.ident = ident;
	this.host = host;
	this.name = name;
	this.players = players;
	this.gameActive = gameActive;
	this.private = private;
	this.password = password;

	this.dealAll	= dealAll;
	this.startHand = startHand;
	this.jokers = jokers;
	this.infinite = infinite;
	this.replaceShuffle = replaceShuffle;

}

module.exports = GameSettingsJS;
