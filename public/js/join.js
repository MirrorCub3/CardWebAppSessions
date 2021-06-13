getGames();
function getGames() {
  console.log("getting games");
    // $.get("/getGameList",function(data){
    //   if(!data.retVal){
    //
    //   }
    // });
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

$( document ).ready(function() {
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
}
