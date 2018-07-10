
const express = require('express');
const bodyParser = require('body-parser');
const { Question } = require('./model');
const router = express.Router();
const jsonParser = bodyParser.json();


router.use(jsonParser);

router.get('/', (req, res, next) => {
  Question.find({})
    .then(result => {
      console.log(typeof result);
      console.log(result);
      res.status(200);
    });
});

module.exports = {router}; 