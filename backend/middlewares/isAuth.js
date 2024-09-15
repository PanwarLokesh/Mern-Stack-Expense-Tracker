const jwt = require("jsonwebtoken");
const isAuthenticated = async (req, res, next) => {
  const headerObj = req.headers;
  const token = headerObj?.authentication?.split(" ")[1];

  const verifyToken = jwt.verify(token, "mysecretkey", (err, decoded) => {
    if (err) {
      return false;
    } else {
      
      return decoded;
    }
  });
  if (verifyToken) {
    req.user = verifyToken.id;
    next();
  } else {
    const err = new Error("Token Expired, Login Again");
    next(err);
  }
};

module.exports = isAuthenticated;
