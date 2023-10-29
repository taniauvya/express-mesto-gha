const router = require('express').Router();

const { EC_NOT_FOUND } = require('../errors/constants');

router.use((req, res, next) => {
  req.user = {
    _id: '653cf25f3bbb44f82c33ba14', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res) => {
  res.status(EC_NOT_FOUND).send({ message: 'Нет обработчика данного пути' });
});

module.exports = router;
