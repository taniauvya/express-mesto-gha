const Card = require('../models/card');
const UnathorizedError = require('../errors/UnathorizedError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        return Promise.reject(new UnathorizedError('Нельзя удалить чужую карточку'));
      }

      return card;
    })
    .then((card) => card.populate(['likes', 'owner']))
    .then((card) => card.deleteOne())
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch(next);
};

function changeCardLike(req, res, next, doLike) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    doLike ? { $addToSet: { likes: req.user._id } } : { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['likes', 'owner'])
    .then((card) => res.send(card))
    .catch(next);
}

module.exports.likeCard = (req, res, next) => changeCardLike(req, res, next, true);

module.exports.dislikeCard = (req, res, next) => changeCardLike(req, res, next, false);
