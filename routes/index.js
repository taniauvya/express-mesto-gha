const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { EC_NOT_FOUND } = require('../errors/constants');

const {
  login, createUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
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
