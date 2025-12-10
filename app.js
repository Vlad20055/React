require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// routes (will create files)
const authRouter = require('./src/routes/auth');
const clientsRouter = require('./src/routes/clients');
const devicesRouter = require('./src/routes/devices');
const repairsRouter = require('./src/routes/repairs');
const aiRouter = require('./src/routes/ai');

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/repairs', repairsRouter);
app.use('/api/ai', aiRouter);

app.get('/', (req, res) => res.json({ service: 'Service Center API', variant: 18 }));

const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/service_center';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Service Center API running at http://localhost:${port}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
