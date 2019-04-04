const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  isbn: { type: Number },
  inStock: { type: [String] }, //bookId
  toBeShipped: { type: [String] } //bookid
});

// Define and export
module.exports = mongoose.model('inventory', inventorySchema);