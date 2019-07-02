'use strict';

module.exports = function(app) {
  app.get('/', (req, res) =>
    res.json({
      message: 'Welcome to books store API!',
      version: '1.0.0',
      date: new Date()
    })
  );

  app.use('/api/books', require('./books'));
  app.use('/api/authors', require('./authors'));
};
