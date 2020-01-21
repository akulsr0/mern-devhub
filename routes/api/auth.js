const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route     GET api/auth
// @desc      Authenticate User
// @access    Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// @route     POST api/auth
// @desc      Login Route
// @access    Public
router.post(
  '/',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Enter a valid password').exists()
  ],
  async (req, res) => {
    // Check for Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    try {
      // Get Email, Password from Request Object
      const { email, password } = req.body;
      // If user doesn't exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      // Matching Email and Password
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      } else {
        const payload = {
          user: {
            id: user.id
          }
        };
        jwt.sign(
          payload,
          config.get('jwtToken'),
          { expiresIn: 3600000 },
          (err, token) => {
            res.json({ token });
          }
        );
      }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);

module.exports = router;
