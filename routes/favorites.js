'use strict';

const express = require('express');
const knex = require('../knex');

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
})

router.get('/favorites/check', (req, res, next) => {
  knex('favorites')
  .count('*')
  .where('book_id', req.query.bookId)
  .then(countObj => {
    let count = countObj[0].count * 1;
    res.send(count > 0);
  })
})

module.exports = router;
