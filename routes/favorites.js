'use strict';

const express = require('express');
const knex = require('../knex');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line new-cap
const router = express.Router();

const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/favorites', (req, res, next) => {
  let userId = getUserId(req);
  if (!userId) {
    res.header('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized')
  }
  knex('favorites')
  .innerJoin('books', 'books.id', 'favorites.book_id')
  .where('user_id', userId)
  .then((favorites) => {
    res.send(camelizeKeys(favorites));
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/favorites/check', (req, res, next) => {
  let userId = getUserId(req);
  if (!userId) {
    res.header('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized')
  }
  knex('favorites')
  .count('*')
  .where('book_id', req.query.bookId)
  .where('user_id', userId)
  .then(countObj => {
    let count = countObj[0].count * 1;
    res.send(count > 0);
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/favorites', (req, res, next) => {
  let userId = getUserId(req);
  if (!userId) {
    res.header('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized')
  }
  knex('favorites')
  .insert({user_id: userId, book_id: req.body.bookId}, '*')
  .then((favorites) => {
    res.send(camelizeKeys(favorites[0]));
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/favorites', (req, res, next) => {
  let userId = getUserId(req);
  if (!userId) {
    res.header('Content-Type', 'text/plain');
    return res.status(401).send('Unauthorized')
  }
  knex('favorites')
  .where({user_id: userId, book_id: req.body.bookId})
  .del()
  .returning(['book_id', 'user_id'])
  .then((favorites) => {
    res.send(camelizeKeys(favorites[0]));
  })
  .catch((err) => {
    next(err);
  });
});

function getUserId(req) {
  if (!req.cookies.token) {
    return;
  }
  let decodedToken = jwt.decode(req.cookies.token, {complete: true});
  return decodedToken.payload.sub.id;
}

module.exports = router;
