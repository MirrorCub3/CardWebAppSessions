module.exports = class Player {
    constructor(ident, name) {
        this.active = false;
        this.hand = [];
        this.tableHand = [];
        this.ident = parseInt(ident);
        this.name = name;
    }
    defaultState(ident){
      this.active = false;
      this.hand = [];
      this.tableHand = [];
      this.ident = parseInt(ident);
      this.name = name;
    }
}
