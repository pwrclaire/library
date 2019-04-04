const mongoose = require('mongoose');

const physicalBookSchema = mongoose.Schema({
    isbn: { type: Number }
});

// Define and export
module.exports = mongoose.model('physicalBook', physicalBookSchema);