const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const UserSchema = mongoose.Schema({
  displayName:{
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
  },
},{timestamps: true});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    displayName: this.name || '',
    id: this._id,
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 8);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };