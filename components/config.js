
const crypto = require("crypto");

//generate a secure random secret key with 32 bytes (256 bits) length
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = {
  jwtSecret: generateSecretKey(),
};
