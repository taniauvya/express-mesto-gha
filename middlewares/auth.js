const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    req.user = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  next(); // пропускаем запрос дальше
};
