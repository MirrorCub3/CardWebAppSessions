function SetGame(){
    $.post("/create",{playernum:$("#playernum").val(), handnum:$("#hand").val(), name:$("#name").val(),
          infinite:$("#Infinite").prop("checked"),shuffleon:$("#ShuffleOn").prop("checked"),
          joker:$("#Joker").prop("checked")},success);
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
function success(data) {
    switch(data.error) {
        // case 0: alert("Game Created!");;break;
        case 1: alert("Invalid Starting Hand");break;
        case 2: alert("No Current Game");break;
        case 3: alert("Name Updated");break;
        case 4: alert("Text Inputs Can Only Include Letters And Numbers");break;
        // case 5: alert("Game Ended");break;
        // case 6: alert("Bad Create: Game In Progress");break;
    }
    if($("#GameButton").val() == "Create Game"){
        $("#GameButton").val("End Game");
        $("#GameButton").attr( 'title',"End The Current Running Game");
        $("#GameButton").attr( 'onClick',"EndGame()");
    }
    else if($("#GameButton").val() == "End Game"){
        $("#GameButton").val("Create Game");
        $("#GameButton").attr( 'title',"Start New Game - This Will Clear Any Previous Game History");
        $("#GameButton").attr( 'onClick',"SetGame()");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
check();
function check() {
    $.get("/indexCheck",{playernum:parseInt($("#playernum").val()),joker:$("#Joker").prop("checked")}, checkSuccess);
    let numMilliSeconds = 250;
    setTimeout(check, numMilliSeconds);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkSuccess(data){
    document.getElementById("numPlayers").innerHTML = "Active Players: " + data.active;
    if(data.gameactive == true){
        $('#playernum').attr("disabled", true);
        $('#hand').attr("disabled", true);
        $('#Infinite').attr("disabled", true);
        $('#ShuffleOn').attr("disabled", true);
        $("#Joker").attr("disabled", true);

        //$("#GameButton").val("End Game");
        //$("#GameButton").attr( 'title',"End The Current Running Game");
        //$("#GameButton").attr( 'onClick',"EndGame()");

        // if(data.discard.length > 0){
        //   $("#DiscardToMain").removeAttr("disabled");
        //   $("#DiscardToMain").val("Discard To Main");
        // }
        // else{
        //   $("#DiscardToMain").attr("disabled", true);
        //   $("#DiscardToMain").val("Discard Empty");
        // }

        if($("#Infinite").prop("checked")){
          $("#DiscardToMain").attr("disabled", true);
          $("#DiscardToMain").val("Discard To Main");
          $("#DiscardToMain").attr( 'title',"Cannot Send Discard To Main In Infinite Mode");
        }
        else{
          $("#DiscardToMain").attr( 'title',"Return Discards To Main");
        }

        // if(data.empty == true){
        //   $("#Shuffle").val("Main Empty");
        //   $("#Shuffle").attr("disabled", true);
        // }
        // else if(data.empty == false){
        //   $("#Shuffle").val("Shuffle Main");
        //   $("#Shuffle").removeAttr("disabled");
        // }

        // document.getElementById("openGame").textContent = "Open On /player";
    }
    else if(data.gameactive == false){
        $('#playernum').removeAttr("disabled");
        $('#hand').removeAttr("disabled");
        $('#Infinite').removeAttr("disabled");
        $("#Joker").removeAttr("disabled");
        $('#ShuffleOn').attr("disabled", !$("#Infinite").prop("checked"));
        if($("#ShuffleOn").is(":disabled")){
            $("#ShuffleOn").prop('checked', false);
        }
        // $("#DiscardToMain").attr("disabled", true);
        // $("#DiscardToMain").val("Discard To Main");
        // $("#Shuffle").attr("disabled", true);

        document.getElementById("openGame").textContent = "";

        $("#hand").attr( 'max',data.maxhand);
        if($("#hand").val() > data.maxhand){
            $("#hand").val(data.maxhand)
        }
        $("#GameButton").val("Create Game");
        $("#GameButton").attr( 'title',"Start New Game - This Will Clear Any Previous Game History");
        $("#GameButton").attr( 'onClick',"SetGame()");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    //$("#GameButton").click(SetGame);
    $("#updateButton").click(UpdateGame);
    //$("#end").click(EndGame);
    $.get("/start",function(data){
        if(!data)
            return;
        $("#playernum").val(data.playernum);
        $("#hand").val(data.handnum);
        $("#name").val(data.gamename);
        $("#Infinite").prop('checked', data.infinite);
        $("#ShuffleOn").prop('checked', data.shuffleon);
        $("#Joker").prop('checked', data.joker);
    });
});
