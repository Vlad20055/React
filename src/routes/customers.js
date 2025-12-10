const express = require('express');
const router = express.Router();
const store = require('../store');

router.get('/', (req, res) => {
  res.json(store.listCustomers());
});

router.post('/', (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'name и phone обязательны' });
  const c = store.createCustomer({ name, phone, email });
  res.status(201).json(c);
});

router.get('/:id', (req, res) => {
  const c = store.getCustomer(req.params.id);
  if (!c) return res.status(404).json({ error: 'customer not found' });
  res.json(c);
});

router.put('/:id', (req, res) => {
  const data = req.body;
  const c = store.updateCustomer(req.params.id, data);
  if (!c) return res.status(404).json({ error: 'customer not found' });
  res.json(c);
});

router.delete('/:id', (req, res) => {
  const ok = store.deleteCustomer(req.params.id);
  if (!ok) return res.status(404).json({ error: 'customer not found' });
  res.status(204).end();
});

module.exports = router;
