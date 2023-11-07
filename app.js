const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(cookieParser());

app.use(require('./routes/index'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
  /* eslint-allow no-console */
});
