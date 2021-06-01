

  		function userClicked(){


          if (/^[ ]*[ ]*$/.test($("#username").val())||/^[ ]*[ ]*$/.test( $("#psw").val())) // username not empty, and password not empty
          {
            alert("bad signup");
            return false;
          }
          $.post("/signup",{username:$("#username").val(), password:$("#psw").val()},function(data) // post request, sending in the username and password
          {
            console.log(data.redirect);
            // if (data.redirect == "/session" && $("#username").val() != "admin") // if the account created is admin- skip over the createclicked
            // {
            //   createClicked(); // this calls the function below to set default values to the server
            // }
            window.location = data.redirect; // will return to /session
          });

    			return false;
    	}

      // function createClicked(){ // calls to routesData not routes
      //
      //     $.ajax({
      //       url: "/create",
      //       type: "POST",
      //       data: {
      //       grade:9,volleyball:false,basketball:false,soccer:false,driver:false// storing default values upon create-- hardcoded
      //       },
      //       success: function(data){
      //         if (!data.retVal)
      //           alert("bad create");
      //         else
      //           alert("good create");
      //         } ,
      //       dataType: "json"
      //     });
      //   return false;
      // }


  		$(document).ready(function(){

        $("#username").keydown( function( event ) {
            if ( event.which === 13 ) { // enter keys
              userClicked();
              event.preventDefault();
              return false;
            }
        });

        $("#psw").keydown( function( event ) {
            if ( event.which === 13 ) {
              userClicked();
              event.preventDefault();
              return false;
            }
        });

  		});
