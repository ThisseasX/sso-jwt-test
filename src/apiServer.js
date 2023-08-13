const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { AUTH_SECRET, COOKIE_EXPIRATION_SEC } = require('./constants');

const app = express();

app
  .use(cors({ origin: '*' }))
  .use(cookieParser())
  // .use(async (req, res, next) => {
  //   const { authtoken } = req.headers;

  //   try {
  //     await axios.post(
  //       'http://localhost:3000/verify',
  //       undefined,
  //       {
  //         headers: {
  //           authtoken,
  //         },
  //       },
  //     );

  //     next();
  //   } catch (err) {
  //     console.error(err);
  //     res.status(401).end();
  //   }
  // })
  .use(async (req, res, next) => {
    const { authtoken } = req.headers;

    try {
      jwt.verify(authtoken, AUTH_SECRET);
      next();
    } catch (err) {
      console.error(err);
      res.status(401).end();
    }
  })
  .get('/data', (req, res) => {
    res.json({ data: 345 });
  })
  .listen(3002, () => {
    console.log('API server is listening on port 3002');
  });
