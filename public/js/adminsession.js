
let identList = []; // this will hold all students to have in a dropdown

  		function readClicked(){ // read button function


        if ($("#names").val() == null)
          return false;

console.log($("#names").val());
console.log($("select[name='names'] option:selected").index());
console.log(identList[$("select[name='names'] option:selected").index()].ident);


let zident = identList[$("select[name='names'] option:selected").index()].ident; // gets what ident it is for the student selected
console.log("zident " + zident);

    $.get("/readAdmin",{ident:zident}, // routesData

          function(data){
              if (!data.retVal)
                alert("bad read");
              else {
  // sets the browser wit the correct info = callback
                $("#volleyball").prop("checked",data.retVal.volleyball);

                $("#basketball").prop("checked",data.retVal.basketball);

                $("#soccer").prop("checked",data.retVal.soccer);

                $("#grade").val(data.retVal.grade);

                $("#driver").prop("checked",data.retVal.driver);


                alert("good read");
              }
            }

          );



  		  return false;
  		}


      function updateClicked(){ // update button function


          console.log($("#names").val());
          console.log($("select[name='names'] option:selected").index());
          console.log(identList[$("select[name='names'] option:selected").index()].ident);


          let zident = identList[$("select[name='names'] option:selected").index()].ident; // same as read - gettting id of the selected student
          console.log("zident " + zident);


          $.ajax({
            url: "/updateAdmin", // in routesData
            type: "PUT",

            data: {ident:zident,name:$("#names").val(),
            grade:$("#grade").val(),volleyball:$("#volleyball").prop("checked"),basketball:$("#basketball").prop("checked"),
            soccer:$("#soccer").prop("checked") , driver:$("#driver").prop("checked")

            },
            success: function(data){
              if (!data.retVal)
                alert("bad update");
              else
                alert("good update");
            } ,
            dataType: "json"
          });
        return false;
      }
      function deleteClicked(){
        if(identList.length == 0)
            return;
        console.log($("#names").val());
        console.log($("select[name='names'] option:selected").index());
        console.log(identList[$("select[name='names'] option:selected").index()].ident);


        let zident = identList[$("select[name='names'] option:selected").index()].ident; // same as read - gettting id of the selected student
        console.log("zident " + zident);

          $.ajax({
            url: "/deleteAdmin/" + zident, // sending in the id and deleting
            type: "DELETE",
            success: function(data) {
              if (!data)
                alert("bad delete");
              else if (data.retVal){
                alert("good delete");
                window.location = "/session";
              }
              else
                alert("bad delete");
            } ,
            dataType: "json"
          });
          return false;
      }


function logoutClicked(){
	$.get("/logout",function(data){
		window.location = data.redirect;
	});
	return false;
}


$(document).ready(function(){
  console.log("adminsession ready");
//  $("#createButton").click(createClicked);
  $("#readButton").click(readClicked);
  $("#updateButton").click(updateClicked);
  $("#deleteButton").click(deleteClicked);


	$.get("/adminInfo",function(data){ // this gets all the student users on document load
		if (data.username) {
      console.log("in adminInfo");
      $("#session").html("Admin Session " + data.username + " " + data.ident); // changes the header to match username and id
      identList = [];
//console.log(data.userList);
        for (let i=0;i<data.userList.length;i++) {
          console.log(data.userList[i].name);
          identList.push({ident:data.userList[i].ident});
          $('#names').append($('<option>', { value : data.userList[i].name }).text(data.userList[i].name)); // appending each student to a dropdown
        }
        readClicked();
    }
	});

	$("#logout").click(logoutClicked);

  $("form").submit(function(event)
  {
//        if ($("#identifier").val() == "") {
//          alert("NO ID");
//          return false;
//        }
//        if ($("#name").val() == "") {
//          alert("NO NAME");
//          return false;
//        }


    return false;
  })



});
