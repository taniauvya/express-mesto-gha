const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const { isCelebrateError } = require('celebrate');
const AuthError = require('../errors/AuthError');
const UnathorizedError = require('../errors/UnathorizedError');

const {
  EC_INVALID, EC_NOT_FOUND, EC_DEFAULT, EC_EMAIL_DUP,
} = require('../errors/constants');

function JoiErrToMsg(joiErr) {
  const msg = { statusCode: EC_INVALID, error: 'Bad Request', message: joiErr.message };
  const validation = {};
  joiErr.details.forEach((v, k) => {
    validation.source = k;
    validation.keys = [];
    Object.values(v.details).forEach((e) => {
      validation.keys = [...validation.keys, ...e.path];
    });
  });
  msg.validation = validation;
  return msg;
}

/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */

  if (err instanceof AuthError || err instanceof UnathorizedError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (isCelebrateError(err)) {
    res.status(EC_INVALID).send(JoiErrToMsg(err));
  } else if (err instanceof ValidationError) {
    res.status(EC_INVALID).send({ message: err.message });
  } else if (err instanceof CastError) {
    res.status(EC_INVALID).send({ message: err.message });
  } else if (err instanceof DocumentNotFoundError) {
    res.status(EC_NOT_FOUND).send({ message: 'Объект не найден' });
  } else if (err.code === 11000) {
    res.status(EC_EMAIL_DUP).send({ message: 'Данный email уже зарегистрирован' });
  } else {
    res.status(EC_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-allow no-console */
  }
};
