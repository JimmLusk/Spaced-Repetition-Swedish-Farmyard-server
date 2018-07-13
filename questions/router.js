
const express = require('express');
const bodyParser = require('body-parser');
const { Question } = require('./model');
const { User } = require('../users/model');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');


router.use(jsonParser);

const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/next', jwtAuth, (req, res, next) => {
  let userId = req.user._id;
  let qRefObj;
  console.log(`${req.user.username} requested their next question`);
  User.findById(userId)
    .then(user => {
      qRefObj = user.order[user.position];
      return user.order[user.position].qId;
    }).then(qId => {
      return Question.findById(qId);
    }).then(question => {
      res.status(202).json({
        _id: question._id,
        imgSrc: question.imgSrc,
        svWord: question.svWord,
        enWord: question.enWord, 
        timesAnswered: qRefObj.timesAnswered, 
        timesCorrect: qRefObj.timesCorrect,  
        weight: qRefObj.weight });
    }).catch(err => {
      next(err);
    });
});

router.post('/answer', jwtAuth, (req, res, next)=>{
  let userId = req.user._id;
  let { correct } = req.body;
  
  User.findById(userId)
    .then(user => {

      // Validate if `correct` is of the correct type
      if(typeof correct !== 'boolean'){
        Promise.reject({
          code: 400,
          reason: 'Bad Request',
          message: 'Value of `correct` must be of type boolean',
        });
      }
    
      const position = user.position; // Position/index of question just answered
      const currentQuestion = user.order[position]; // 
      const questionWeight = currentQuestion.weight;

      User.findById(userId, (err, user) => {
        if(err){
          Promise.reject({
            code: 500,
            message: 'Couldn`t find user'
          });
        }

        let newWeight;
        if(correct){
          if(questionWeight < 32){
            newWeight = Math.floor(questionWeight*2);
          } else {
            newWeight = 32;
          }
          
          user.order[position].timesAnswered += 1;
          user.order[position].timesCorrect += 1;
        } else {
          newWeight = 1;
          user.order[position].timesAnswered += 1;
        }

        user.position = currentQuestion.nextIndex;
        user.order[position].weight = newWeight;

        let currentNode = user.order[position];
        for(let i = 1; i <= newWeight; i++){
          currentNode = user.order[currentNode.nextIndex];
        }
        let temp = currentNode.nextIndex;
        currentNode.nextIndex = position;
        user.order[position].nextIndex = temp;

        user.save(() => {
          console.log(`Reordered for ${user.username}`);
        });
      });

    })
    .then(() => {
      res.status(202).json({correct});
    }).catch(err => {

      if (err.reason === 'Bad Request') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});

    });
});

module.exports = {router}; 