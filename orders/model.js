const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const OrderSchema = mongoose.Schema({
  order: {
    type: [String],
    default: [{q: 'wolf', next: 1}, 'bear','horse','cat','pig','chicken','spider','turtle', 'fish', 'dog'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };

