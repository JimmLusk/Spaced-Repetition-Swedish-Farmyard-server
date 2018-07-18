const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();

const { PORT, CLIENT_ORIGIN, CLIENT_ORIGIN_2, MONGODB_URI } = require('./config');
const { dbConnect } = require('./db-mongoose');

const localStrategy = require('./auth/local');
const jwtStrategy = require('./auth/jwt');

const {router: authRouter } = require('./auth/router');
const {router: userRouter} = require('./users/router');
const {router: questionRouter} = require('./questions/router');

const app = express();

passport.use(localStrategy);
passport.use(jwtStrategy);

const whitelist = [CLIENT_ORIGIN, CLIENT_ORIGIN_2];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(
  cors(corsOptions)
);

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/q', questionRouter);

app.get('/api/test', (req, res, next) => {
  res.json('It works');
});

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  console.info(`Database connected at ${MONGODB_URI}`);
  runServer();
}

module.exports = { app };
