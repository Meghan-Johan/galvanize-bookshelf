'use strict';

const express = require('express');
const knex = require('../knex');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line new-cap
const router = express.Router();

const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/favorites', (req, res, next) => {
  knex('favorites')
  .innerJoin('books', 'books.id', 'favorites.book_id')
  .then((favorites) => {
    res.send(camelizeKeys(favorites));
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/favorites/check', (req, res, next) => {
  knex('favorites')
  .count('*')
  .where('book_id', req.query.bookId)
  .then(countObj => {
    let count = countObj[0].count * 1;
    res.send(count > 0);
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/favorites', (req, res, next) => {
  let decoded = jwt.decode(req.cookies.token, {complete: true});
  let userId = decoded.payload.sub.id;
  knex('favorites')
  .insert({user_id: userId, book_id: req.body.bookId}, '*')
  .then((favorites) => {
    res.send(camelizeKeys(favorites[0]));
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
