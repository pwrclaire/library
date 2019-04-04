const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  bookId: { type: String }
});

// Define and export
const Order = module.exports = mongoose.model('order', orderSchema);