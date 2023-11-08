const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;

const NotFoundError = require('./NotFoundError');
const ValidError = require('./ValidError');
const DupError = require('./DupError');

module.exports.handleUpdateErr = (next, err, notFoundMsg) => {
  let errRes = err;

  if (err instanceof ValidationError || err instanceof CastError) {
    errRes = new ValidError();
  } else if (err instanceof DocumentNotFoundError) {
    errRes = new NotFoundError(notFoundMsg);
  }

  next(errRes);
};

module.exports.handleCreateErr = (next, err) => {
  let errRes = err;

  if (err instanceof ValidationError) {
    errRes = new ValidError();
  } else if (err.code === 11000) {
    errRes = new DupError();
  }

  next(errRes);
};

module.exports.handleGetSingleErr = (next, err, notFoundMsg) => {
  let errRes = err;

  if (err instanceof CastError) {
    errRes = new ValidError();
  } else if (err instanceof DocumentNotFoundError) {
    errRes = new NotFoundError(notFoundMsg);
  }

  next(errRes);
};
