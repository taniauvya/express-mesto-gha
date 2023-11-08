class DupError extends Error {
  constructor() {
    super('Пользователь с данным email уже зарегистрирован');
    this.statusCode = 409;
  }
}

module.exports = DupError;
