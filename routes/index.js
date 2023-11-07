const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { EC_NOT_FOUND } = require('../errors/constants');
const { linkRx } = require('../validations/constants');

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
    avatar: Joi.string().custom((value, helpers) => {
      if (!linkRx.test(value)) {
        return helpers.message('Некорректная ссылка');
      }

      return value;
    }),
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

router.use((req, res) => {
  res.status(EC_NOT_FOUND).send({ message: 'Нет обработчика данного пути' });
});

router.use(require('../middlewares/error'));

module.exports = router;
