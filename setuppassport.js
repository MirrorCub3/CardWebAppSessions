var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) { // acceses the users collection not the infos
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "No user has that username!" });
      }
      user.checkPassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user); // returns pointer to the user
        } else {
          return done(null, false, { message: "Invalid password." });
        }
      });
    });
  }));
};
