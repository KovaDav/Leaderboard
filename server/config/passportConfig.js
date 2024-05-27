const LocalStrategy = require('passport-local').Strategy;
const {login, serialize} = require('../db/db.js');
const { comparePassword } = require('../utils/hashUtils');

const initializePassport = (passport) => {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const result = await login(username);
        console.log(result);
        const user = result[0];
        if (!user) {
          return done(null, false, { message: 'No user with that username' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Password incorrect' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await serialize(id);
      done(null, result[0]);
    } catch (err) {
      done(err);
    }
  });
};


exports.initializePassport = initializePassport;

