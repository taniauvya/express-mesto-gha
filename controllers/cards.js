const Card = require('../models/card');

const { handleCreateErr, handleGetSingleErr, handleGeneralError } = require('../errors/handlers');

const notFoundMsg = 'Карточка по указанному _id не найдена';

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((cards) => res.send(cards))
    .catch((err) => handleGeneralError(res, err));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .populate(['likes', 'owner'])
    .then((card) => res.send(card))
    .catch((err) => handleGetSingleErr(res, err, notFoundMsg));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => handleCreateErr(res, err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .populate(['likes', 'owner'])
    .then((card) => res.send(card))
    .catch((err) => handleGetSingleErr(res, err, notFoundMsg));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .populate(['likes', 'owner'])
    .then((card) => res.send(card))
    .catch((err) => handleGetSingleErr(res, err, notFoundMsg));
};
