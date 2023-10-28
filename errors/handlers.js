const { EC_INVALID, EC_DEFAULT } = require('./constants');

module.exports.handleUpdateErr = (res, err) => {
  if (err.name === 'ValidationError') {
    res.status(EC_INVALID);
  } else if (err.name === 'CastError') {
    res.status(EC_INVALID);
  } else {
    res.status(EC_DEFAULT);
  }
  res.send({ message: err.message });
};

module.exports.handleCreateErr = (res, err) => {
  if (err.name === 'ValidationError') {
    res.status(EC_INVALID);
  } else {
    res.status(EC_DEFAULT);
  }
  res.send({ message: err.message });
};

module.exports.handleGetSingleErr = (res, err) => {
  if (err.name === 'CastError') {
    res.status(EC_INVALID);
  } else {
    res.status(EC_DEFAULT);
  }
  res.send({ message: err.message });
};
