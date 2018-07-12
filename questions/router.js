
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
    
      const position = user.position; // Position(index) of question just answered
      const currentQuestion = user.order[position]; // 
      const questionId = currentQuestion.qId; 
      const questionWeight = currentQuestion.weight;
      
      //increment position to positions.next before other things get wonky
      User.findOneAndUpdate({_id: userId}, {$set: {position: currentQuestion.nextIndex}}, () => {
        console.log('incremented to next position');
      });

      let newWeight;
      if(correct){
        //double weight
        newWeight = Math.floor(questionWeight*2);
        User.findOneAndUpdate({_id: userId, 'order.qId': `${questionId}`}, {$set: {'order.$.weight': newWeight}},() => {
          console.log('hopefully incremented weight');
        });
      } else {
        newWeight = 1;
        User.findOneAndUpdate({_id: userId, 'order.qId': `${questionId}`}, {$set: {'order.$.weight': newWeight}},() => {
          console.log('hopefully set weight to 1');
        });
      }

      //find index that is question just answered's index + weight (may need % with the length)
      //          OR am I supposed to traverse?
      let newNextIndex = position + newWeight;
      if(newNextIndex > user.order.length-1){
        let m = newNextIndex % user.order.length;
        newNextIndex = m;
      }
      //set next of index found above to index of the question just answered
      let setObj1 = {};
      setObj1[`order.${position}.nextIndex`] = newNextIndex;
      User.findOneAndUpdate({_id: userId}, {$set: setObj1},  () => {
        console.log(`set current question's next to ${newNextIndex}`);
      });
      //set question just answered's next to the next of the index changes above
      let setObj2 = {};
      setObj2['order.' + newNextIndex + '.nextIndex'] = position;
      User.findOneAndUpdate({_id: userId}, {$set: setObj2},  () => {
        console.log(`set new next question's next to ${position}`);
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