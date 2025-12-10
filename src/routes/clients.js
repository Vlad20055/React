const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Client = require('../models/client');

// list with search/sort
router.get('/', async (req, res) => {
  try {
    const { q, sortBy = 'createdAt', order = 'desc', page = 1, perPage = 20 } = req.query;
    const filter = {};
    if (q) filter.$or = [ { name: new RegExp(q,'i') }, { phone: new RegExp(q,'i') }, { email: new RegExp(q,'i') } ];
    const clients = await Client.find(filter).sort({ [sortBy]: order === 'asc' ? 1 : -1 }).skip((page-1)*perPage).limit(Number(perPage));
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create
// create (requires auth)
router.post('/', auth,
  body('name').trim().notEmpty().withMessage('name required'),
  body('phone').trim().notEmpty().withMessage('phone required'),
  body('email').optional().isEmail().withMessage('invalid email'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, phone, email, address } = req.body;
      const client = new Client({ name, phone, email, address });
      await client.save();
      res.status(201).json(client);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const c = await Client.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'client not found' });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update (requires auth)
router.put('/:id', auth,
  body('email').optional().isEmail().withMessage('invalid email'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const c = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!c) return res.status(404).json({ error: 'client not found' });
      res.json(c);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// delete (requires auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
