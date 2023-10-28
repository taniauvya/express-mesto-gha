const User = require('../models/user');

const EC_INVALID = 400;
const EC_NOT_FOUND = 404;
const EC_DEFAULT = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(EC_DEFAULT).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(EC_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => res.status(EC_DEFAULT).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(EC_INVALID);
      } else {
        res.status(EC_DEFAULT);
      }
      res.send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(EC_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(EC_INVALID);
      } else {
        res.status(EC_DEFAULT);
      }
      res.send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(EC_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(EC_INVALID);
      } else {
        res.status(EC_DEFAULT);
      }
      res.send({ message: err.message });
    });
};
