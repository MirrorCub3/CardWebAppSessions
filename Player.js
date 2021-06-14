module.exports = class Player {
    constructor(ident, name, gameIdent) {
        this.active = false;
        this.hand = [];
        this.tableHand = [];
        this.ident = parseInt(ident);
        this.name = name;
        this.gameIdent = gameIdent;
    }
    // defaultState(ident){
    //   this.active = false;
    //   this.hand = [];
    //   this.tableHand = [];
    //   this.ident = parseInt(ident);
    //   this.name = name;
    //   this.gameIdent = gameIdent;
    // }
}
