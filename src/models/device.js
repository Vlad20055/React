const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  serial: { type: String, required: true, index: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
