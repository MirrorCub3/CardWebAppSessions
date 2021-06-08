
      var ident = 0;
      var name = "";
      let openEdit = false;

      // function updateClicked(){ // updte butto function
      //     $.ajax({
      //       url: "/update", // in routesData
      //       type: "PUT",
      //
      //       data: {
      //       grade:$("#grade").val(),volleyball:$("#volleyball").prop("checked"),basketball:$("#basketball").prop("checked"),
      //       soccer:$("#soccer").prop("checked"), driver:$("#driver").prop("checked")
      //
      //       },
      //       success: function(data){
      //         if (!data.retVal)
      //           alert("bad update");
      //         else
      //           alert("good update");
      //       } ,
      //       dataType: "json"
      //     });
      //   return false;
      // }


function logoutClicked(){ //logout function
    console.log("log out");
	$.get("/logout",function(data){ // in routes
		window.location = data.redirect;
	});
	return false;
}
function ToggleVis(){
  var x = $("#password");
    if (x.attr('type') == "password") {
      x.attr("type", 'text');
    } else {
      x.attr("type", 'password');
    }
}
function updateClicked(){
  if(/^[ ]*[ ]*$/.test($("#password").val())){
    alert("bad password");
    return;
  }
      $.ajax({
        url: "/changepsw", // in routes
        type: "POST",

        data: {
          ident: ident,
          password:$("#password").val()
        },
        success: function(data){
          if(!data.retVal){
            alert("bad password");
          }
          if (data.retVal){
            alert("password updated");
              $("#password").val("");
          }
        } ,
        dataType: "json"
      });
    return false;
}
function onEdit(){
    if(openEdit)
        return;
    openEdit = true;
    $("#edit").attr('hidden', true);
    $("#editInfo").attr('hidden', false);
}
function onCancel(){
  $("#editInfo").attr('hidden', true);
  openEdit = false;
  $("#edit").attr('hidden', false);
}
function getCreate(){
  $.get("/create",function (data){
    console.log('data redirect: ' + data.redirect);
      window.location = data.redirect;
  });
}
$(document).ready(function(){ //called on the load to udate th broswr to match the stored student info
  console.log("session ready");
//  $("#createButton").click(createClicked);
  // $("#readButton").click(readClicked);
//  $("#deleteButton").click(deleteClicked);


	$.get("/userInfo",function(data){ // gets the values stored in the database
      console.log("in userInfo");
		if (data.retVal.name) {
      console.log(data.retVal.name);
      console.log(data.retVal.ident);

      ident =  data.retVal.ident;
      name = data.retVal.name;
      $("#name").text("Welcome " + name);
      $.(".dropbtn").text(name);
      console.log("name =" + name);
// sets the browser wit the correct info = callback
    }
    //
    // $("#psw").keydown( function( event ) {
    //     if ( event.which === 13 ) {
    //       userClicked();
    //       event.preventDefault();
    //       return false;
    //     }
    // });

	});


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
