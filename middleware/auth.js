const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  // If no token
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify Token
  try {
    const decoded = jwt.verify(
      token,
      config.get('jwtToken'),
      (err, decoded) => {
        if (err) {
          res.status(401).json({ msg: 'Invalid Token' });
        }
        req.user = decoded.user;
        next();
      }
    );
  } catch (err) {
    res.status(401).json({ msg: 'Server Error' });
  }
};
