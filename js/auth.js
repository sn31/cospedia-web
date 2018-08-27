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

function User(email,password) {
  this.email = email;
  this.password = password;
}

User.prototype.signUp = function() {
  firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function (err) {
    alert("Unable to sign up!")
  })
}

User.prototype.signIn = function() {
  firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(err) {
    alert("Unable to sign in. Please verify email and password!")
  })
}

User.prototype.signOut = function() {
  firebase.auth().signOut().catch(function(err) {
    alert("Unable to sign out!")
  })
}
User.prototype.resetPassword = function() {
  firebase.auth().sendPasswordResetEmail(this.email).then(function() {
    alert("An email has been sent to you!");
  }).catch(function(err) {
    alert("Unable to reset password!")
  })
}
$(document).ready (function() {
  $("#signUp").submit(function(event) {
    event.preventDefault();
    var email = $("#emailSU").val();
    var password = $("#passwordSU").val();
    var passwordConf = $("#passwordConfSU").val()

    if (password !== passwordConf) {
      alert("Passwords don't match. Please verify!");
    }
    else { var newUser = new User(email, password)};
    console.log(newUser);
    newUser.signUp();
  })
  $("#signIn").submit(function(event) {
    event.preventDefault();
    var email = $("#emailSI").val();
    var password = $("#passwordSI").val();
    var newUser = new User(email, password);
    console.log(newUser);
    newUser.signIn();
    alert("Signed in successfully!")
  })

  $("#forgotPasswordButton").click(function() {
    window.location.href = './forgotPassword.html'
  })

  $("#forgotPassword").submit(function(event) {
    event.preventDefault();
    var email = $(".email").val();
    var newUser = new User(email);
    newUser.resetPassword();
  })
})