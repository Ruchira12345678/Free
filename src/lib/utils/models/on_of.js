// on_of.js in the utils/models directory
const mongoose = require('mongoose');

const OnOffSchema = new mongoose.Schema({
  guildID: { type: String, required: true },
  type: { type: String, required: true },
  onOrOff: { type: String, required: true }
});

module.exports = mongoose.model('OnOff', OnOffSchema);
