
const express = require('express');
const bodyParser = require('body-parser');
const { Question } = require('./model');
const { User } = require('../users/model');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');



router.use(jsonParser);

router.get('/', (req, res, next) => {
  Question.find({})
    .then(result => {
      console.log(typeof result);
      console.log(result);
      res.status(200);
    });
});

const jwtAuth = passport.authenticate('jwt', {session: false});
router.get('/next', jwtAuth, (req, res, next) => {
  let userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .then(user => {
      let position = user.position;
      let currentNode = user.order[position];
      let questionId = currentNode.qId;
      //User.findByIdAndUpdate(userId, {position: currentNode.nextId});
      return questionId;
    }).then(qId => {
      console.log(qId);
      return Question.findById(qId);
    }).then(question => {
      console.log(question);
      res.json(question);
    }).catch(err => {
      next(err);
    });
  
  
});

module.exports = {router}; 