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
  order: {
    type: [{qId: mongoose.Schema.Types.ObjectId, nextIndex: Number}]
    //example: [{q:0, nextIndex:1},{q:1, nextIndex:2},{q:2, nextIndex:3},{q:3, nextIndex:0}]
  },
  position: {
    type: Number,
    default: 0
  }
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