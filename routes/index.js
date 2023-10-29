const router = require('express').Router();

const { EC_NOT_FOUND } = require('../errors/constants');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res) => {
  res.status(EC_NOT_FOUND).send({ message: 'Нет обработчика данного пути' });
});

module.exports = router;
