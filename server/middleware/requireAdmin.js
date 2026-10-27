const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({ msg: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.userType !== "Admin") {
      return res.status(403).send({ msg: "Admin access required" });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).send({ msg: "Invalid or expired authentication token" });
  }
};
