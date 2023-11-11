const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const token = req?.cookies?.jwt;

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  return next(); // пропускаем запрос дальше
};
