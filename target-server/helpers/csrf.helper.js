const {v4: uuid} = require("uuid");

const csrfToken = (sessionId) => {
  const token = uuid();
  const userTokens = _TOKENS.get(sessionId);
  userTokens.add(token);
  setTimeout(() => userTokens.delete(token), 30000);

  return token;
};

module.exports = {
  csrfToken,
};
