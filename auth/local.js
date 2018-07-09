const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../users/model.js');

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({username})
    .then(result => {
      user = result;
      if(!user){
        return Promise.reject({
          reason: 'LoginError',
          message: 'Wrong username',
          location: 'username'
        });
      }
      return user.validatePassword(password);
    })
    .then(valid => {
      if(!valid){
        return Promise.reject({
          reason: 'LoginError',
          message: 'Wrong password',
          location: 'password'
        });
      }
      return done(null, user);
    })
    .catch(err => {
      if(err.reason === 'LoginError'){
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;