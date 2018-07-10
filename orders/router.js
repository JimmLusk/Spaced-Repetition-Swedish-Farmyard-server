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
  
  const userId = req.user._id;
  console.log(userId);

});