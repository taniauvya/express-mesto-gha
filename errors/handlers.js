const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const { EC_INVALID, EC_DEFAULT, EC_NOT_FOUND } = require('./constants');

const handleGeneralError = (res, err) => {
  res.status(EC_DEFAULT).send({ message: 'На сервере произошла ошибка' });
  /* eslint-disable no-console */
  console.error(err);
  /* eslint-allow no-console */
};

module.exports.handleGeneralError = handleGeneralError;

module.exports.handleUpdateErr = (res, err, notFoundMsg) => {
  if (err instanceof ValidationError) {
    res.status(EC_INVALID).send({ message: err.message });
  } else if (err instanceof CastError) {
    res.status(EC_INVALID).send({ message: err.message });
  } else if (err instanceof DocumentNotFoundError) {
    res.status(EC_NOT_FOUND).send({ message: notFoundMsg });
  } else {
    handleGeneralError(res, err);
  }
};

module.exports.handleCreateErr = (res, err) => {
  if (err instanceof ValidationError) {
    res.status(EC_INVALID).send({ message: err.message });
  } else {
    handleGeneralError(res, err);
  }
};

module.exports.handleGetSingleErr = (res, err, notFoundMsg) => {
  if (err instanceof CastError) {
    res.status(EC_INVALID).send({ message: err.message });
  } else if (err instanceof DocumentNotFoundError) {
    res.status(EC_NOT_FOUND).send({ message: notFoundMsg });
  } else {
    handleGeneralError(res, err);
  }
};
