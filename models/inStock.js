const mongoose = require('mongoose');

const inStockSchema = mongoose.Schema({
  bookId: { type: String }
});

// Define and export
module.exports = mongoose.model('inStock', inStockSchema);