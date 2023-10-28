const Card = require('../models/card');

const EC_INVALID = 400;
const EC_NOT_FOUND = 404;
const EC_DEFAULT = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(EC_DEFAULT).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate(['likes', 'owner'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(EC_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((err) => res.status(EC_DEFAULT).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(EC_INVALID);
      } else {
        res.status(EC_DEFAULT);
      }
      res.send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['likes', 'owner'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(EC_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((err) => res.status(EC_DEFAULT).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['likes', 'owner'])
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(EC_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((err) => res.status(EC_DEFAULT).send({ message: err.message }));
};
