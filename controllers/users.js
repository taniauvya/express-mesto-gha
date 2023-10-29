const User = require('../models/user');

const {
  handleUpdateErr, handleCreateErr, handleGetSingleErr, handleGeneralError,
} = require('../errors/handlers');

const notFoundMsg = 'Пользователь по указанному _id не найден';

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleGeneralError(res, err));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleGetSingleErr(res, err, notFoundMsg));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => handleCreateErr(res, err, notFoundMsg));
};

function updateUser(req, res, updateObj) {
  User.findByIdAndUpdate(req.user._id, updateObj, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleUpdateErr(res, err, notFoundMsg));
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};
