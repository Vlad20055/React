const express = require('express');
const router = express.Router();
const Repair = require('../models/repair');
const Device = require('../models/device');

// List repairs with search/sort
router.get('/', async (req, res) => {
  try {
    const { q, sortBy = 'createdAt', order = 'desc', page = 1, perPage = 20 } = req.query;
    const filter = {};
    if (q) filter.description = new RegExp(q, 'i');
    const repairs = await Repair.find(filter).populate({ path: 'device', populate: { path: 'client' } }).sort({ [sortBy]: order === 'asc' ? 1 : -1 }).skip((page-1)*perPage).limit(Number(perPage));
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create repair
router.post('/', async (req, res) => {
  try {
    const { deviceId, description, status, cost, technician, estimatedCompletion } = req.body;
    if (!deviceId || !description) return res.status(400).json({ error: 'deviceId and description required' });
    const device = await Device.findById(deviceId);
    if (!device) return res.status(400).json({ error: 'device not found' });
    const repair = new Repair({ device: deviceId, description, status, cost, technician, estimatedCompletion });
    await repair.save();
    res.status(201).json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await Repair.findById(req.params.id).populate({ path: 'device', populate: { path: 'client' } });
    if (!r) return res.status(404).json({ error: 'repair not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const r = await Repair.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!r) return res.status(404).json({ error: 'repair not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
