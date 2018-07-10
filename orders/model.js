const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const OrderSchema = mongoose.Schema({
  order: {
    type: [String],
    default: ['dog', 'wolf', 'bear','horse','cat','pig','chicken','spider','turtle', 'fish'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };

