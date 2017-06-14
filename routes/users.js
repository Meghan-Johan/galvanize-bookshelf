'use strict';

const express = require('express');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  const password = req.body.password;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds)
    .then(passwordHash => {
      knex('users')
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: passwordHash
      }, '*')
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        next(err);
      });
    })
})

module.exports = router;
