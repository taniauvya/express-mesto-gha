const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    req.user = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return next(new AuthError('Необходима авторизация'));
  }

  return next(); // пропускаем запрос дальше
};
