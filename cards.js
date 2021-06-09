module.exports = class Deck {
    constructor(shuffle = false, jokerCheck = false) {
        this.deck = [];
        this.deck.length = 0;
        this.discard = [];
        this.discard.length = 0;
        this.imageId = 0;

        this.shuffleOnReplace = shuffle;
        this.drawActive = false;
        this.joker = jokerCheck;
        this.drawDiscardActive = false;
        const suites = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
        const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];
        const images = [
         /// aces
          "/views/PNG/AH.png", //aceHearts
          "/views/PNG/AS.png", //aceSpades
          "/views/PNG/AC.png", //aceClubs
          "/views/PNG/AD.png", //aceDiamonds
          ///2s
          "/views/PNG/2H.png", //twoHearts
          "/views/PNG/2S.png", //twoSpades
          "/views/PNG/2C.png", //twoclub
          "/views/PNG/2D.png", //twoDiamonds
          ///3s
          "/views/PNG/3H.png",
          "/views/PNG/3S.png",
          "/views/PNG/3C.png",
          "/views/PNG/3D.png",
          //4s
          "/views/PNG/4H.png",
          "/views/PNG/4S.png",
          "/views/PNG/4C.png",
          "/views/PNG/4D.png",
          ///5s
          "/views/PNG/5H.png",
          "/views/PNG/5S.png",
          "/views/PNG/5C.png",
          "/views/PNG/5D.png",
          //6s
          "/views/PNG/6H.png",
          "/views/PNG/6S.png",
          "/views/PNG/6C.png",
          "/views/PNG/6D.png",
          //7s
          "/views/PNG/7H.png",
          "/views/PNG/7S.png",
          "/views/PNG/7C.png",
          "/views/PNG/7D.png",
          //8s
          "/views/PNG/8H.png",
          "/views/PNG/8S.png",
          "/views/PNG/8C.png",
          "/views/PNG/8D.png",
          //9s
          "/views/PNG/9H.png",
          "/views/PNG/9S.png",
          "/views/PNG/9C.png",
          "/views/PNG/9D.png",
          //10
          "/views/PNG/10H.png",
          "/views/PNG/10S.png",
          "/views/PNG/10C.png",
          "/views/PNG/10D.png",
          //jack
          "/views/PNG/JH.png",
          "/views/PNG/JS.png",
          "/views/PNG/JC.png",
          "/views/PNG/JD.png",
          //queen
          "/views/PNG/QH.png",
          "/views/PNG/QS.png",
          "/views/PNG/QC.png",
          "/views/PNG/QD.png",
          //king
          "/views/PNG/KH.png",
          "/views/PNG/KS.png",
          "/views/PNG/KC.png",
          "/views/PNG/KD.png"
        ];
        for (let value in values) {
            for (let suite in suites) {
                this.deck.push(new Card(values[value],suites[suite],images[this.imageId],false)); // array of card objects
                this.imageId++;
            }
        }
        if(this.joker == true){
            this.deck.push(new Card("Joker","JokerBlack","/views/joker_black.png"));
            this.deck.push(new Card("Joker","JokerRed","/views/joker_red.png"));
        }
    }
    shuffle(){
        if(this.deck.length == 0)
            return;
        this.preShuffle = this.deck;
        this.shuffled = [];
        this.shuffled.length = this.preShuffle.length;
        for(let card in this.shuffled){ // turn all spaces to null first
            this.shuffled[card] = null;
        }
        for(let card in this.preShuffle){ // find a new spot for the given card in the new shuffled array
            let newIndex = NewSpot(this.shuffled); // find a random index
            while(this.shuffled[newIndex] != null){
                newIndex = NewSpot(this.shuffled); // if the spot is taken, find another
            }
            this.shuffled[newIndex] = this.preShuffle[card];// once the null index is found, point it to the card
        }
        this.deck = this.shuffled; // once shuffled, make this the new deck
    }
    Discard(card){
      this.discard[this.discard.length] = card;
    }
    DiscardToMain(){
        if(this.discard.length <= 0){
            return;
        }
        for(let id1 = 0; id1 < this.discard.length; id1++){
            for(let id2 = id1 + 1; id2 < this.discard.length; id2++){
                if(this.discard[id1] != null && this.discard[id2] != null && this.discard[id1].value == this.discard[id2].value &&
                   this.discard[id1].suite == this.discard[id2].suite){
                      this.discard[id1] = null;
                }
            }
        }
        for(let cur in this.discard){
            if(this.discard[cur] === null){
                this.discard.splice(cur, 1);
            }
        }
        for(let card in this.discard){
            this.deck[this.deck.length] = this.discard[card];
        }
        if(this.shuffleOnReplace){ this.shuffle(); }
        this.discard.length = 0;
    }
    Draw(){
      if(this.drawActive == true){
          return;
      }
        this.drawActive = true;
        if(this.deck.length > 0){
            this.returnCard = this.deck[0];
            this.deck.splice(0, 1); // draws from the beginning of the array and removes it afterwards
            this.drawActive = false;
            return(this.returnCard);
        }
        else{
            this.drawActive = false;
            return(null);
        }
    }
    DrawDiscard(){
      if(this.drawDiscardActive == true){
          return;
      }
        this.drawDiscardActive = true;
        if(this.discard.length > 0){
            this.returnCard = this.discard[this.discard.length-1];
            this.discard.splice(this.discard.length-1, 1);
            this.drawDiscardActive = false;
            return(this.returnCard);
        }
        else{
            this.drawDiscardActive = false;
            return(null);
        }
    }
    ReturnHand(hand){
        for (let card in hand){
            this.deck[this.deck.length] = hand[card];
        }
    }
    CheckEmpty(){
        if(this.deck.length < 1){
            return(true);
        }
        else {
          return(false);
        }
        //$('input').prop('readonly',true);
    }
    FindIndex(targetCard,hand){
     for (let card in hand){
         if(targetCard.value == hand[card].value && targetCard.suite == hand[card].suite){
             return(card);
         }
     }
     return(-1);
   }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Card (value,suite,image, flipped = false) {
    this.value = value;
    this.suite = suite;
    this.image = image;
    this.filpped = flipped;
}
function NewSpot(array){
    return Math.floor(Math.random() * array.length);
}
