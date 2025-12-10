// Простое in-memory хранилище для лабораторной

let customerId = 1;
let deviceId = 1;
let repairId = 1;

const customers = [];
const devices = [];
const repairs = [];

function createCustomer({ name, phone, email }) {
  const c = { id: customerId++, name, phone, email };
  customers.push(c);
  return c;
}

function getCustomer(id) {
  return customers.find(c => c.id === Number(id));
}

function updateCustomer(id, data) {
  const c = getCustomer(id);
  if (!c) return null;
  Object.assign(c, data);
  return c;
}

function deleteCustomer(id) {
  const idx = customers.findIndex(c => c.id === Number(id));
  if (idx === -1) return false;
  customers.splice(idx, 1);
  return true;
}

function listCustomers() {
  return customers;
}

function createDevice({ customerId: cid, brand, model, serial }) {
  const d = { id: deviceId++, customerId: Number(cid), brand, model, serial };
  devices.push(d);
  return d;
}

function getDevice(id) {
  return devices.find(d => d.id === Number(id));
}

function listDevices() {
  return devices;
}

function createRepair({ deviceId: did, description, status = 'registered', cost = 0, technician = null }) {
  const r = { id: repairId++, deviceId: Number(did), description, status, cost, technician, createdAt: new Date().toISOString() };
  repairs.push(r);
  return r;
}

function getRepair(id) {
  return repairs.find(r => r.id === Number(id));
}

function listRepairs() {
  return repairs;
}

function updateRepair(id, data) {
  const r = getRepair(id);
  if (!r) return null;
  Object.assign(r, data);
  return r;
}

// Seed sample data
createCustomer({ name: 'Иван Иванов', phone: '+7-900-000-0000', email: 'ivan@example.com' });
createCustomer({ name: 'Пётр Петров', phone: '+7-901-111-1111', email: 'petr@example.com' });
createDevice({ customerId: 1, brand: 'Lenovo', model: 'ThinkPad X1', serial: 'SN12345' });
createDevice({ customerId: 2, brand: 'Dell', model: 'XPS 13', serial: 'SN54321' });
createRepair({ deviceId: 1, description: 'Не включается', status: 'diagnostics' });

module.exports = {
  // customers
  createCustomer, getCustomer, updateCustomer, deleteCustomer, listCustomers,
  // devices
  createDevice, getDevice, listDevices,
  // repairs
  createRepair, getRepair, listRepairs, updateRepair
};
