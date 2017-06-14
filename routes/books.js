'use strict';

const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  let id = req.params.id * 1;
  knex('books')
    .where('id', id)
    .then((book) => {
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert(decamelizeKeys(req.body), '*')
    .then((book) => {
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  let id = req.params.id * 1;
  knex('books')
    .where('id', id)
    .update(decamelizeKeys(req.body), '*')
    .then((book) => {
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let id = req.params.id * 1;
  knex('books')
    .where('id', id)
    .del()
    .returning('*')
    .then((book) => {
      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
