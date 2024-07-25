const { request, response } = require("express");

const csrf = (req, res, next) => {
  const token = req.body.csrf;
  if (!token || !tokens.get(req.sessionID).has(token)) {
    res.status(422).send("CSRF Token missing or expired");
  } else {
    next();
  }
};


module.exports = { csrf };