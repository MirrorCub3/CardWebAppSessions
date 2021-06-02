$( document ).ready(function() {
  //  $("#messages").append('<li>' + GameSettings.id + '</li>');
   function loadGames(){
 $.ajax({
            url: "/getGameList",
            type: "GET",
            data: {},
            success: function(data){
              if (!data.retVal)
                alert("bad read");
              else {

            
                $("#messages").append('<li>' + data.host+ data.name+ data.players+ data.jokers+ data.infinite +'</li>');
                alert("good read");
              }
            } ,     
            dataType: "json"
          });     
  		  return false;
  		}   
});