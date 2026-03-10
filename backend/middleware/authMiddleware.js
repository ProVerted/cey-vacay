const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Check if a token was sent in the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // 2. Extract the token (format is "Bearer <token>")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user's ID to the request so routes can use it
    req.userId = decoded.id;
    next(); // move on to the actual route handler

  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = protect;