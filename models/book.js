const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: { type: String },
  author: { type: String },
  isbn: { type: Number },
  width: { type: Number },
  height: { type: Number }
});

// Define and export
module.exports = mongoose.model('Book', bookSchema);