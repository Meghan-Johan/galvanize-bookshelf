'use strict';

const knex = require('../knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/token', (req, res) => {
  if (req.cookies.token) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

router.post('/token', (req, res) => {
  let user;
  knex('users')
    .first()
    .where('email', req.body.email)
    .then((userData) => {
      user = userData;
      let hashedPassword = user.hashed_password;
      return bcrypt.compare(req.body.password, hashedPassword);
    })
    .then((success) => {
      if (!success) {
        return res.send('Bad password');
      }
      const jwtPayload = {
        iss: 'bookshelf_app',
        sub: {
          email: user.email,
          id: user.id
        },
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        loggedIn: true
      };
      const opts = {
        httpOnly: true
      };
      const secret = process.env.JWT_KEY;
      const token = jwt.sign(jwtPayload, secret);
      let response = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
      res.cookie('token', token, opts).send(response);
    })
    .catch((err) => {
      // res.status(500).send("Error in POST /token");
      res.status(500).send(err);
    });
});

router.delete('/token', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).send(true);
});


module.exports = router;
