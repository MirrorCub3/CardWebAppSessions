var ident = 0;
var name = "";

const deckClassic = 52;
const deckJoker = 54;
const defaultName = "Virtual Cards";

const handInput = "<input id='hand' type='number' name='hand' min = '0' max = '60' step = '1' value = '0' title = 'The Amount Of Cards Each Player Starts With' onchange = 'onChangePlayer()'>";
const pswInput = "<div id= 'pswInput'><label for = 'psw'> Password:</label><input id = 'psw' type = 'password' name = 'psw' maxlength='10' title = 'Password For Private Game'><input type = 'checkbox' id = 'show' title= 'Show Password' onclick='ToggleVis()'></div>";
const shuffleInput = "<div id = 'shuffleDiv'><label for = 'ShuffleOn'>Shuffle On Replacement: </label>  <input type = 'checkbox' id = 'ShuffleOn' title= 'Shuffle Discard Pile Into To Main Deck'></div>";
var deckSize = deckClassic;
function SetGame(){
  console.log("In SetGame");
  if(/^[ ]*[ ]*$/.test($("#name").val())){
    console.log("bad name");
  }
  let all = false;
  if($("#deal").val() == "DealAll"){
      all = true;
  }
  console.log( name + " " + $("#name").val() + " " + $("#playernum").val()+ " " +$("#Private").prop('checked') + " " + $("#psw").val() + " " + all + " " + $("#hand").val()+ " " + $("#Joker").prop("checked") + " " + $("#Infinite").prop("checked") + " " +$("#ShuffleOn").prop("checked") );
  $.post("/creategame",{hostName:name, name:$("#name").val(), players:$("#playernum").val(), gameActive: true, private:$("#Private").prop('checked'),
          password:$("#psw").val(),dealAll:all, startHand:$("#hand").val(), jokers:$("#Joker").prop("checked"), infinite:$("#Infinite").prop("checked"),replace:$("#ShuffleOn").prop("checked")},
          function(data){
              window.redirect = "/views/player.html";
          });
}
function onChangeDeal(){
// check dealType change
     if($("#deal").val() != "StartingHand"){
       $("#hand").remove();
     }
     else{
       $("#Player").append(handInput)
     }
}

function onChangePlayer(){
  if($("#Joker").prop("checked")){
      deckSize = deckJoker;
  }
  else{
      deckSize = deckClassic;
  }
  let maxHand = parseInt(deckSize/$("#playernum").val());
  if($("#hand").val() > maxHand){
      $("#hand").attr( 'max',maxHand);
      $("#hand").val(maxHand);
  }
  else{
    $("#hand").attr( 'max',deckSize);
  }
}
function onChangeText(){
    console.log("change text");
    if(!validString($("#name").val())){
      $("#name").val("");
    }
}
function ToggleVis(){
  var x = $("#psw");
  console.log(x.attr('type'));
    if (x.attr('type') == "password") {
      x.attr("type", 'text');
    } else {
      x.attr("type", 'password');
    }
    console.log(x);
}
function onChangePrivate(){
    if($("#Private").prop('checked')){
      $("#pswDiv").append(pswInput);
    }
    else{
       $("#pswInput").remove();
    }
}
function onChangeInfinite(){
  console.log("chnage infinite");
    if($("#Infinite").prop('checked')){
      $("#infiniteDiv").append(shuffleInput);
    }
    else{
       $("#shuffleDiv").remove();
    }
}
function accountClicked(){
  $.get("/successlogin",function (data){
      window.location = data.redirect;
  });
}
function validString(string) {
    let regex =  /^[A-Za-z0-9?!/#@%^$&,"'* ]*[A-Za-z0-9?!/#@%^$&,"'* ]*$/;
    let  validString = regex.test(string);
    return (validString);
 }
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// function UpdateGame(){
//     $.post("/update", {name:$("#name").val()},success);
// }
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// function EndGame(){
//     $.get("/end",success);
// }
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// function discardToMain(){
//     $.post("/discardtomain",null);
// }
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// function ShuffleMain(){
//     $.post("/shuffle",null);
// }
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// function success(data) {
//     switch(data.error) {
//         // case 0: alert("Game Created!");;break;
//         case 1: alert("Invalid Starting Hand");break;
//         case 2: alert("No Current Game");break;
//         case 3: alert("Name Updated");break;
//         case 4: alert("Text Inputs Can Only Include Letters And Numbers");break;
//         // case 5: alert("Game Ended");break;
//         // case 6: alert("Bad Create: Game In Progress");break;
//     }
//     if($("#GameButton").val() == "Create Game"){
//         $("#GameButton").val("End Game");
//         $("#GameButton").attr( 'title',"End The Current Running Game");
//         $("#GameButton").attr( 'onClick',"EndGame()");
//     }
//     else if($("#GameButton").val() == "End Game"){
//         $("#GameButton").val("Create Game");
//         $("#GameButton").attr( 'title',"Start New Game - This Will Clear Any Previous Game History");
//         $("#GameButton").attr( 'onClick',"SetGame()");
//     }
// }
// /////////////////////////////////////////////////////////////////////////////////////////////////////////
// check();
// function check() {
//     $.get("/indexCheck",{playernum:parseInt($("#playernum").val()),joker:$("#Joker").prop("checked")}, checkSuccess);
//     let numMilliSeconds = 250;
//     setTimeout(check, numMilliSeconds);
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// function checkSuccess(data){
//     document.getElementById("numPlayers").innerHTML = "Active Players: " + data.active;
//     if(data.gameactive == true){
//         $('#playernum').attr("disabled", true);
//         $('#hand').attr("disabled", true);
//         $('#Infinite').attr("disabled", true);
//         $('#ShuffleOn').attr("disabled", true);
//         $("#Joker").attr("disabled", true);
//
//         //$("#GameButton").val("End Game");
//         //$("#GameButton").attr( 'title',"End The Current Running Game");
//         //$("#GameButton").attr( 'onClick',"EndGame()");
//
//         // if(data.discard.length > 0){
//         //   $("#DiscardToMain").removeAttr("disabled");
//         //   $("#DiscardToMain").val("Discard To Main");
//         // }
//         // else{
//         //   $("#DiscardToMain").attr("disabled", true);
//         //   $("#DiscardToMain").val("Discard Empty");
//         // }
//
//         if($("#Infinite").prop("checked")){
//           $("#DiscardToMain").attr("disabled", true);
//           $("#DiscardToMain").val("Discard To Main");
//           $("#DiscardToMain").attr( 'title',"Cannot Send Discard To Main In Infinite Mode");
//         }
//         else{
//           $("#DiscardToMain").attr( 'title',"Return Discards To Main");
//         }
//
//         // if(data.empty == true){
//         //   $("#Shuffle").val("Main Empty");
//         //   $("#Shuffle").attr("disabled", true);
//         // }
//         // else if(data.empty == false){
//         //   $("#Shuffle").val("Shuffle Main");
//         //   $("#Shuffle").removeAttr("disabled");
//         // }
//
//         // document.getElementById("openGame").textContent = "Open On /player";
//     }
//     else if(data.gameactive == false){
//         $('#playernum').removeAttr("disabled");
//         $('#hand').removeAttr("disabled");
//         $('#Infinite').removeAttr("disabled");
//         $("#Joker").removeAttr("disabled");
//         $('#ShuffleOn').attr("disabled", !$("#Infinite").prop("checked"));
//         if($("#ShuffleOn").is(":disabled")){
//             $("#ShuffleOn").prop('checked', false);
//         }
//         // $("#DiscardToMain").attr("disabled", true);
//         // $("#DiscardToMain").val("Discard To Main");
//         // $("#Shuffle").attr("disabled", true);
//
//         document.getElementById("openGame").textContent = "";
//
//         $("#hand").attr( 'max',data.maxhand);
//         if($("#hand").val() > data.maxhand){
//             $("#hand").val(data.maxhand)
//         }
//         $("#GameButton").val("Create Game");
//         $("#GameButton").attr( 'title',"Start New Game - This Will Clear Any Previous Game History");
//         $("#GameButton").attr( 'onClick',"SetGame()");
//     }
// }
function logoutClicked(){ //logout function
  console.log("log out");
	$.get("/logout",function(data){ // in routes
		window.location = data.redirect;
	});
	return false;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
  console.log("ready");
  $.get("/userInfo",function(data){ // gets the values stored in the database
      console.log("in userInfo");
		if (data.retVal.name) {
      console.log(data.retVal.name);
      console.log(data.retVal.ident);

      ident =  data.retVal.ident;
      name = data.retVal.name;

      $.(".dropbtn").text(name);
    }
	});
});
