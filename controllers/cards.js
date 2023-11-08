const Card = require('../models/card');
const UnathorizedError = require('../errors/UnathorizedError');

const { handleUpdateErr, handleCreateErr, handleGetSingleErr } = require('../errors/handlers');

const notFoundMessage = 'Карточка с данным ID не найдена';

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new UnathorizedError('Нельзя удалить чужую карточку');
      }

      return card;
    })
    .then((card) => card.deleteOne())
    .then((card) => res.send(card))
    .catch((err) => handleGetSingleErr(next, err, notFoundMessage));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => handleCreateErr(next, err));
};

function changeCardLike(req, res, next, doLike) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    doLike ? { $addToSet: { likes: req.user._id } } : { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => handleUpdateErr(next, err, notFoundMessage));
}

module.exports.likeCard = (req, res, next) => changeCardLike(req, res, next, true);

module.exports.dislikeCard = (req, res, next) => changeCardLike(req, res, next, false);
