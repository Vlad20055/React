const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['registered','diagnostics','in_repair','awaiting_parts','completed','cancelled'], default: 'registered' },
  cost: { type: Number, default: 0 },
  technician: { type: String },
  estimatedCompletion: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Repair', RepairSchema);
