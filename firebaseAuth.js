$('document').ready(function() {

    $("#login").on('click', function() {
        // variables 
        var email = $("#email").val().trim().toString();
        var password = $("#password").val().trim().toString();

        //console log click event 
        console.log("login click recognized");
        console.log("email: " + email);
        // console.log("password: " + password);

        console.log("firebase.provider: " + firebase.provider);
        console.log("firebase.auth().signInWithEmailAndPassword: " + firebase.auth().signInWithEmailAndPassword);

        // authentication
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            console.log("authentication script worked");

           // Handle Errors here.
            // variables to hold error messages
            var errorCode = error.code;
            var errorMessage = error.message;

            // console log the error codes
            console.log("errorCode: " + errorCode);
            console.log("errorMessage: " + errorMessage);

            if (errorCode === 'auth/wrong-password') {
                $(".cardMessage").html("<p><br>" + errorMessage + "</p>");
                // clear the input fields
                $("#email").val("");
                $("#password").val("");
            } else {
                // display the error message above the regular login message
                $(".cardMessage").html("<p><br>" + errorMessage + "</p>");

                // clear the input fields
                $("#email").val("");
                $("#password").val("");
            }

            // firbase email and password authentication closing brackets
        });

        return false;

        // login on click closing brackets
    });

    // forgot password on click event
    $("#forgot").on('click', function() {
        console.log("forgot button click is recognized");

        var auth = firebase.auth();
        var email = $("#email").val().trim();

        auth.sendPasswordResetEmail(email).then(function() {
            // Email sent.
        }, function(error) {
            // An error happened.
        });

        return false;

        //closing brackets for forgot password on click event 
    });

    var user = firebase.auth().currentUser;

            // event listener for authentication state change
            firebase.auth().onAuthStateChanged(function(user) {
                if (user !== null) {
                    console.log('logged in!');
                    console.log("user: " + user);

                    // test authentication
                    console.log("firebase.User.uid: " + firebase.auth().currentUser.uid);

                    // console log the variables
                    console.log("email: " + email);
                    url = "dashboard.html";
                    $(location).attr("href", url);
                }
                
                // authentication listener closing brackets
            });



    // document on ready function closing brackets 
});


// // // // // // // // // // // // // // // // // // // // // // // // 
// code purgatory // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // // 
// // // // // // // // // // // // // // // // // // // // // // // //
// // // // // // // // // // // // // // // // // // // // // // // //
// 
// // // failed authentication coded
// 	this.onAuth('onComplete', function(authData) {
// 	  if (authData) {
// 	    console.log("Authenticated with uid:", authData.uid);
// 	  } else {
// 	    console.log("Client unauthenticated.")
// 	  }
// });
// 
// 
// // // // copied from firebase docs website
// Firebase ref = new Firebase("https://metoperatfcb.firebaseio.com");
// ref.authWithPassword("bobtony@firebase.com", "correcthorsebatterystaple", new Firebase.AuthResultHandler() {
//     @Override
//     public void onAuthenticated(AuthData authData) {
//         System.out.println("User ID: " + authData.getUid() + ", Provider: " + authData.getProvider());
//     }

//     @Override
//     public void onAuthenticationError(FirebaseError firebaseError) {
//         // there was an error
//     }
// });
// 
// // // //	start exclude code borroed from firebase quick-start on github
// if (errorCode = 'auth/wrong-password') {
// 	$(".card-title").children().html("<p>The password you have entered is incorrect.</p><br><p>Please try again, or enter your email and click 'I forgot my password.'");
// } else {
// 	$(".card-title").children().html(errorMessage);
// }
// 
// 	console.log("children of .card-title: ")
//
// console.log(error);
// document.getElementById('quickstart-sign-in').disabled = false;
// // // // [END_EXCLUDE]
// 
// 
// 
// 
// // // // log previous user out just in case left logged on
// if (firebase.auth().currentUser) {
//   // [START signout]
//   firebase.auth().signOut();
//   // [END signout]
// } 
// else {