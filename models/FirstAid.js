const mongoose = require('mongoose');

const firstAidSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
  advice: { type: String, required: true }
});

module.exports = mongoose.model('FirstAid', firstAidSchema);
