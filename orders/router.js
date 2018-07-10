const express = require('express');
const bodyParser = require('body-parser');
const { Order } = require('./model');
const { Question } = require('../questions/model');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');

router.use(jsonParser);
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/:id', jwtAuth, (req, res, next) => {
  
  const userId = req.user.id;
  //console.log(userId);
  Order.findById(userId).
    then(result => {
      console.log(result);
    });

});


module.exports = {router};