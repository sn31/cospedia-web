// Initialize Firebase
var config = {
  apiKey: "AIzaSyCsXeeqQGEXp7WQAB7WU4blJmS0rCIAZaU",
  authDomain: "makeup-genius-702f9.firebaseapp.com",
  databaseURL: "https://makeup-genius-702f9.firebaseio.com",
  projectId: "makeup-genius-702f9",
  storageBucket: "makeup-genius-702f9.appspot.com",
  messagingSenderId: "416277350179"
};
firebase.initializeApp(config);

function User(email, password) {
  this.email = email;
  this.password = password;
}

User.prototype.signUp = function () {
  firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(function() {
    alert("You have signed up successfully!")
    $("#signUpClose").click();
    $("#private").show();
    $("#public").hide();
  })
  
  .catch(function (err) {
    alert("Unable to sign up. Please try again!")
  })
}

User.prototype.signIn = function () {
  firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function(){
    $("#signInClose").click();
    alert("You have signed in successfully!")
  })
  .catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === "auth/wrong-password") {
      alert("Wrong password.")
    } else {
      alert(errorMessage);
    }
  })
}

User.prototype.signOut = function () {
  firebase.auth().signOut().then(function() {
    alert("You have signed out successfully!")
  }).catch(function (err) {
    alert("Unable to sign out!")
  })
}


User.prototype.resetPassword = function () {
  firebase.auth().sendPasswordResetEmail(this.email).then(function () {
    $("#forgotPasswordClose").click();
    alert("An email has been sent to you!");
  }).catch(function (err) {
    alert("Unable to reset password!")
  })
}
$(document).ready(function () {
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     alert("You are already signed in")
  //   } else {
  //     alert("You have not signed in!")
  //   }
  //   console.log(user);
  // })
  $("#signUp").submit(function (event) {
    event.preventDefault();
    var email = $("#emailSU").val();
    var password = $("#passwordSU").val();
    var passwordConf = $("#passwordConfSU").val()
    if (password !== passwordConf) {
      alert("Passwords don't match. Please verify!");
    }
    else { var newUser = new User(email, password) };
    newUser.signUp();
  })
  $("#signIn").submit(function (event) {
    event.preventDefault();
    var email = $("#emailSI").val();
    var password = $("#passwordSI").val();
    var newUser = new User(email, password);

    newUser.signIn();
  //Check if the user is signed in
  var user = firebase.auth().currentUser;
  if (user) {
    $("#private").show();
    $("#public").hide();
  } else {
    alert("You have not signed in!")
  }
  })

  // Forgot password
  $("#forgotPasswordButton").click(function () {
    $("#signInModal").modal('hide');
  })

  // Reset password
  $("#forgotPassword").submit(function (event) {
    event.preventDefault();
    var email = $("#emailFP").val();
    var newUser = new User(email);
    newUser.resetPassword();
  })

  $("#signOutButton").click(function () {
    $("#private").hide();
    $("#public").show();
  })
})