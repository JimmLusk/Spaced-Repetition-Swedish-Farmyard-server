
const mongoose = require('mongoose');
mongoose.promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  imgSrc:{
    type: String,
  },
  svWord: {
    type: String,
  },
  enWord: {
    type: String,
  },
  audioURL: {
    type: String,
  },
  next: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  }
});


const Question = mongoose.model('Question', QuestionSchema);

module.exports = { Question };