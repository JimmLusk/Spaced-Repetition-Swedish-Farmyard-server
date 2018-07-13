const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./model');
const { Question } = require('../questions/model');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');

router.use(jsonParser);

router.post('/', (req, res, next) =>{

  let {displayName, username, password} = req.body;

  let questionsArray;
  return Question.find({}).then(result => {
    let LinkedListArray = result.map((q, index) => {
      if(index === result.length-1){
        return {qId: q._id, nextIndex: 0, weight: 1, timesAnswered: 0, timesCorrect: 0};
      }
      return {qId: q._id, nextIndex: index+1, weight: 1, timesAnswered: 0, timesCorrect: 0};
    });
    console.log(LinkedListArray);
    questionsArray = LinkedListArray;
    return LinkedListArray;
  }).then(() => {
    return User.find({username}).count();
  }).then(count => {
    if(count > 0){
      return Promise.reject({
        code: 422,
        reason: 'ValidationError',
        message: 'Username taken',
        location: 'username',
      });
    }
    return User.hashPassword(password);
  }).then(hash => {
    return User.create({
      username,
      password: hash,
      displayName,
      order: questionsArray,
      position: 0,
    });
  }).then(user => {
    return res.status(201).json(user);
  }).catch(err => {
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    console.log(err);
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

// Everything under here is protected endpoints
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/test', jwtAuth, (req, res, next) => {
  return res.json({
    data: 'rosebud'
  });
});

module.exports = {router};