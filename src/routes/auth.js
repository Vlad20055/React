const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');

const GOOGLE_CLIENT_ID = '95612592596-kg220l1qgdmjfsmmkanklri9rt73ih92.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/register', [
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, password, role } = req.body;
  try {
    let existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const user = new User({ username, password, role });
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'replace_this_with_a_secure_secret', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', [
  body('username').exists(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'replace_this_with_a_secure_secret', { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/google', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token required' });
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    
    let user = await User.findOne({ username: email });
    if (!user) {
      user = new User({ username: email, password: 'google-' + payload.sub, role: 'client' });
      await user.save();
    }
    
    const jwtToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'replace_this_with_a_secure_secret', { expiresIn: '8h' });
    res.json({ token: jwtToken, user: { email, name } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token: ' + err.message });
  }
});

module.exports = router;
