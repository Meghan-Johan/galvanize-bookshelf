'use strict';

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  const password = req.body.password;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds)
    .then(passwordHash => {
      knex('users')
      .insert({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: passwordHash
      }, ['id', 'first_name', 'last_name', 'email'])
      .then((user) => {
        res.send(camelizeKeys(user[0]));
      })
      .catch((err) => {
        next(err);
      });
    })
})

module.exports = router;
