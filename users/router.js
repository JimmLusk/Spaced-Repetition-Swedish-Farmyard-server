const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./model');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');

router.use(jsonParser);

router.post('/', (req, res, next) =>{

  let {displayName, username, password} = req.body;
  return User.find({username})
    .count()
    .then(count => {
      console.log('here 2'+ count);
      if(count > 0){
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username taken',
          location: 'username',
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        displayName,
      });
    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Everything under here is protected endpoints
const jwtAuth = passport.authenticate('jwt', {session: false});



module.exports = {router};