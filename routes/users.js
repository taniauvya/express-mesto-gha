const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getSelfUser, updateUser, updateAvatar,
} = require('../controllers/users');
const { MONGO_ID_LENGTH, linkRx } = require('../validations/constants');

router.get('/', getUsers);

router.get('/me', getSelfUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(MONGO_ID_LENGTH),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkRx),
  }),
}), updateAvatar);

module.exports = router;
