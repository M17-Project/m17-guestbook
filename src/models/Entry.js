const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date
  }
});

module.exports = mongoose.model('Entries', EntrySchema);
