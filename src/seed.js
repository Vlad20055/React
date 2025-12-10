require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Client = require('./models/client');
const Device = require('./models/device');
const Repair = require('./models/repair');

const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/service_center';

async function seed() {
  await mongoose.connect(mongoUrl);
  console.log('Connected to Mongo for seeding');
  await Promise.all([User.deleteMany({}), Client.deleteMany({}), Device.deleteMany({}), Repair.deleteMany({})]);

  const admin = new User({ username: 'admin', password: 'admin123', role: 'admin' });
  const tech = new User({ username: 'tech', password: 'tech123', role: 'technician' });
  await admin.save();
  await tech.save();

  const clients = [];
  for (let i=1;i<=6;i++) {
    clients.push(await new Client({ name: `Client ${i}`, phone: `+7-900-000-00${i}`, email: `client${i}@example.com`, address: `Address ${i}` }).save());
  }

  const devices = [];
  for (let i=1;i<=8;i++) {
    const c = clients[(i-1) % clients.length];
    devices.push(await new Device({ client: c._id, brand: i%2? 'Lenovo':'Dell', model: `Model ${i}`, serial: `SN${1000+i}`, notes: 'Sample device' }).save());
  }

  const statuses = ['registered','diagnostics','in_repair','awaiting_parts','completed'];
  for (let i=0;i<10;i++) {
    const d = devices[i % devices.length];
    await new Repair({ device: d._id, description: `Issue ${i+1}`, status: statuses[i%statuses.length], cost: (i+1)*50, technician: i%2? 'tech':'', estimatedCompletion: new Date(Date.now()+1000*60*60*24*(i%5)) }).save();
  }

  console.log('Seed data created');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
