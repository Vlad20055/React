const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Device = require('../models/device');
const Client = require('../models/client');

// Get devices with optional search and sort
router.get('/', async (req, res) => {
  try {
    const { q, sortBy = 'createdAt', order = 'desc', page = 1, perPage = 20 } = req.query;
    const filter = {};
    if (q) filter.$or = [ { brand: new RegExp(q, 'i') }, { model: new RegExp(q, 'i') }, { serial: new RegExp(q, 'i') } ];
    const devices = await Device.find(filter).populate('client').sort({ [sortBy]: order === 'asc' ? 1 : -1 }).skip((page-1)*perPage).limit(Number(perPage));
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create device (requires auth)
router.post('/', auth,
  body('clientId').trim().notEmpty().withMessage('clientId required'),
  body('brand').trim().notEmpty().withMessage('brand required'),
  body('model').trim().notEmpty().withMessage('model required'),
  body('serial').trim().notEmpty().withMessage('serial required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { clientId, brand, model, serial, notes } = req.body;
      const client = await Client.findById(clientId);
      if (!client) return res.status(400).json({ error: 'client not found' });
      const device = new Device({ client: clientId, brand, model, serial, notes });
      await device.save();
      res.status(201).json(device);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const d = await Device.findById(req.params.id).populate('client');
    if (!d) return res.status(404).json({ error: 'device not found' });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
