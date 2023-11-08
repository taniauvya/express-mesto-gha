const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { linkRx } = require('../validations/constants');
const NotFoundError = require('../errors/NotFoundError');

const {
  login, createUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (!validator.isEmail(value)) {
        return helpers.message('Некорректный email');
      }

      return value;
    }),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRx),
    email: Joi.string().required().custom((value, helpers) => {
      if (!validator.isEmail(value)) {
        return helpers.message('Некорректный email');
      }

      return value;
    }),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(require('../middlewares/auth'));

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res, next) => {
  next(new NotFoundError('Нет обработчика данного пути'));
});

module.exports = router;
