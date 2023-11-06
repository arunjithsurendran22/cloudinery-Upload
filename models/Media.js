const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  url: String,
});

module.exports = mongoose.model('Media', mediaSchema);
