const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { AUTH_SECRET, COOKIE_EXPIRATION_SEC } = require('./constants');

const users = {
  admin: { username: 'admin', password: 'admin' },
  asd: { username: 'asd', password: 'asd' },
  user1: { username: 'user1', password: 'user1' },
  user2: { username: 'user2', password: 'user2' },
  user3: { username: 'user3', password: 'user3' },
};

const app = express();

app.set('view engine', 'ejs');

app
  .use(cookieParser())
  .use(express.json())
  .get('/', (req, res) => {
    res.render('login');
  })
  .post('/login', (req, res) => {
    const { username } = req.body;
    const user = users[username];

    if (user) {
      const authToken = jwt.sign(user, AUTH_SECRET, {
        expiresIn: COOKIE_EXPIRATION_SEC,
      });
      const now = Date.now();
      const iat = Math.round(now / 1000);
      const expires = now + COOKIE_EXPIRATION_SEC * 1000;
      const exp = iat + COOKIE_EXPIRATION_SEC;

      res.cookie('authToken', authToken, {
        sameSite: 'none',
        secure: true,
        expires: new Date(expires),
      });

      res.json({ authToken, user: { ...user, iat, exp } });
    } else {
      res.status(401).end();
    }
  })
  .post('/verify', (req, res) => {
    const authToken = req?.cookies?.authToken || req.headers?.authtoken;

    try {
      const user = jwt.verify(authToken, AUTH_SECRET);
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(401).end();
    }
  })
  .listen(3000, () => {
    console.log('Auth server is listening on port 3000');
  });
