const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route     POST api/users
// @desc      Register User
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please enter your name')
      .not()
      .isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a password of minimum 6 characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      // Existing User
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'Email already registered' }] });
      }
      // Get User Avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // Hash Password
      const hashPass = await bcrypt.hash(password, 10);
      // Create User
      user = new User({ name, email, avatar, password: hashPass });
      await user.save();
      // Return JsonWebToken
      const payload = {
        user: { id: user.id }
      };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      res.status(500).json({ error: [{ msg: err.message }] });
    }
  }
);

module.exports = router;
