const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN, MONGODB_URI } = require('./config');
const { dbConnect } = require('./db-mongoose');

const localStrategy = require('./auth/local');
const jwtStrategy = require('./auth/jwt');

const {router: authRouter } = require('./auth/router');
const {router: userRouter} = require('./users/router');

const app = express();

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);

app.get('/api/test', (req, res, next) => {
  res.json('It works');
});

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
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
