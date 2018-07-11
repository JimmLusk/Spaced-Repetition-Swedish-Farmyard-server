
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
      // User.findOneAndUpdate({_id: userId}, {$set: {position: currentNode.nextIndex}}, (res) => {
      //   console.log(res);
      // });
      return questionId;
    }).then(qId => {
      console.log(qId);
      return Question.findById(qId);
    }).then(question => {
      console.log(question);
      res.status(202).json(question);
    }).catch(err => {
      next(err);
    });
});

router.post('/answer', jwtAuth, (req, res, next)=>{
  let userId = req.user._id;
  let { correct } = req.body;
  const mValue = 2;
  
  User.findById(userId)
    .then(user => {

      //Validate if `correct` is of the correct type
      if(typeof correct !== 'boolean'){
        Promise.reject({
          code: 400,
          reason: 'Bad Request',
          message: 'Value of `correct` must be of type boolean',
        });
      }
    
      let position = user.position;
      let currentNode = user.order[position];
      //let questionId = currentNode.qId;
      User.findOneAndUpdate({_id: userId}, {$set: {position: currentNode.nextIndex}}, () => {
        console.log('incremented to next position');
      });
      //User.findByIdAndUpdate({_id: userId, }, {$set: {order: [] }}, () => {console.log('re-ordered');});
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