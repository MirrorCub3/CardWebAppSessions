const joinDiv = "<div class = '-1' id = 'child'></div>";
const joinAppend = "<section><h2 id = 'gameName'>Virtual Cards</h2><p id = 'playerNum'>Active Players: </p>  <p id = 'hostName'> Host: </p><input id='joinButton' type='button' value=' Join Game ' onclick = joinGame()/></section>";
const findName = $("#gameName");
const findNum = $("#playerNum");
const findHost = $("#hostName");

getGames();
function getGames() {
  console.log("getting games");
    $.get("/getGameList",function(data){
      if(!data.retVal){
        $("#allGames").empty();
        $("#noGame").attr("hidden", false);
        return;
      }
      $("#allGames").empty();
      $("#noGame").attr("hidden", true);
      for (var i = 0; i < data.info.length; i++) {
        console.log(data.info[i].name);
        $("#allGames").append("<div class =" + data.info[i].ident + "  id = 'child'></div>");
        $("."+data.info[i].ident+"").append(joinAppend);
        $("."+data.info[i].ident+"").find(findName).text(data.info[i].name);
        console.log($("."+data.info[i].ident+"").find(findName).text());
      }
    });
    let numMilliSeconds = 2000;
    setTimeout(getGames, numMilliSeconds);
}

function getCreate(){
  $.get("/getCreate",function (data){
    console.log('data redirect: ' + data.redirect);
      window.location = data.redirect;
  });
}
function joinClicked(){
  $.get("/getJoin",function (data){
    console.log('data redirect: ' + data.redirect);
      window.location = data.redirect;
  });
}
function accountClicked(){
  $.get("/successlogin",function (data){
      window.location = data.redirect;
  });
}
function logoutClicked(){ //logout function
  console.log("log out");
	$.get("/logout",function(data){ // in routes
		window.location = data.redirect;
	});
	return false;
}
function joinGame(){
console.log("joinclicked");
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
  //$("#allGames").append(joinAppend);
});
//$( document ).ready(function() {
  //  $("#messages").append('<li>' + GameSettings.id + '</li>');
 //   function loadGames(){
 // $.ajax({
 //            url: "/getGameList",
 //            type: "GET",
 //            data: {},
 //            success: function(data){
 //              if (!data.retVal)
 //                alert("bad read");
 //              else {
 //
 //
 //                $("#messages").append('<li>' + data.host+ data.name+ data.players+ data.jokers+ data.infinite +'</li>');
 //                alert("good read");
 //                var identYY = data.ident;
 //                var r= $('<input type="button" value="Join Game" id = data.ident + "button"/>');
 //                $("messages").append(r);
 //              }
 //            } ,
 //            dataType: "json"
 //          });
 //  		  return false;
 //  		}
    //   $("#data.iddent+'button'").click(sendtoGame);
    // });
// function sendtoGame(){
//   $.post("/sendtogame",{},function(data)
//   {
//     window.location = data.redirect;
//   });}
//}
