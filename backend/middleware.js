const jwt = require("jsonwebtoken");
const config = require("../components/config.js"); // Import JWT secret

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (token == null) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    req.user = user; // Attach the decoded user object to the request
    next(); // Proceed to the next middleware or route
  });
}

module.exports = {
  authenticateToken,
};
