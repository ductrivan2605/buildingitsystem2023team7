const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/user');

async function initialize(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: "No user with that username" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize;
