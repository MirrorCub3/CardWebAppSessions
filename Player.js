module.exports = class Player {
    constructor(id, username) {
        this.active = false;
        this.hand = [];
        this.tableHand = [];
        this.id = parseInt(id);
        //this.username = username;
    }
    defaultState(id){
      this.active = false;
      this.hand = [];
      this.tableHand = [];
      this.id = parseInt(id);
      //this.username = username;
    }
}
