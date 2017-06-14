'use strict';

const express = require('express');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(books);
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
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert(req.body, '*')
    .then((book) => {
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  let id = req.params.id * 1;
  knex('books')
    .where('id', id)
    .update(req.body, '*')
    .then((book) => {
      res.send(book);
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
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});


module.exports = router;
