const joinDiv = "<div class = '-1' id = 'child'></div>";
const joinAppend = "<section><h2 id = 'gameName'> '+data.info[i].name+'</h2><p id = 'playerNum'>Active Players: '+data.info[i].players+'</p>  <p id = 'hostName'> Host: '+data.info[i].host+'</p><input id='joinButton' type='button' value=' Join Game ' onclick = 'joinGame(this)'/></section>";
const findName = $("#gameName");
const findNum = $("#playerNum");
const findHost = $("#hostName");

getGames();
function getGames() {
    $.get("/getGameList",function(data){
      if(!data.retVal){
        $("#allGames").empty();
        $("#noGame").attr("hidden", false);
        return;
      }
      $("#allGames").empty();
      $("#noGame").attr("hidden", true);
      for (var i = 0; i < data.info.length; i++) {
        if(data.info[i].gameActive == true){
        $("#allGames").append("<div class =" + data.info[i].ident + "  id = 'child'></div>");
        $("."+data.info[i].ident+"").append("<section><h2 id = 'gameName'> "+data.info[i].name+"</h2><p id = 'playerNum'>Active Players: "+data.info[i].players+"</p>  <p id = 'hostName'> Host: "+data.info[i].host+"</p><input id='joinButton"+data.info[i].ident+"' type='button' value=' Join Game ' onclick = 'joinGame(this)'/></section>");
        }
      }
    });
    let numMilliSeconds = 2000;
    setTimeout(getGames, numMilliSeconds);
}

function getCreate(){
  $.get("/getCreate",function (data){
      window.location = data.redirect;
  });
}
function joinClicked(){
  $.get("/getJoin",function (data){
      window.location = data.redirect;
  });
}
function accountClicked(){
  $.get("/successlogin",function (data){
      window.location = data.redirect;
  });
}
function logoutClicked(){ //logout function
	$.get("/logout",function(data){ // in routes
		window.location = data.redirect;
	});
	return false;
}
function joinGame(element){
console.log("joinclicked");
let str = element.id.toString();
let gameIdent = str.substring(10,str.length);
console.log(gameIdent);
$.post("/postPlayer",{gameIdent: gameIdent},
    function(data){
        window.location = data.redirect;
});
}
$(document).ready(function(){
  console.log("ready");
  $.get("/userInfo",function(data){ // gets the values stored in the database
      console.log("in userInfo");
		if (data.retVal.name) {
      console.log(data.retVal.name);
      console.log(data.retVal.ident);

      ident =  data.retVal.ident;
      name = data.retVal.name;

      $(".dropbtn").text(name);
    }
	});
});
