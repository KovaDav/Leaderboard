const {register} = require('../db/db');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const passport = require('passport');

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const result = await register(username, hashedPassword);
    res.status(201).json({ success: true, user: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ success: false, message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ success: true, user });
    });
  })(req, res, next);
};

module.exports = { registerUser, loginUser };
