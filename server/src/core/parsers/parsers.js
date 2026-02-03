const fs = require('fs');

const parseBusinessDescription = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return { content };
};

const parseCustomers = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  const customers = lines.slice(1).map(line => {
    const values = line.split(',');
    const customer = {};
    headers.forEach((header, index) => {
      customer[header.trim()] = values[index].trim();
    });
    return customer;
  });
  return customers;
};

const parseSupportFlows = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return { content };
};

const parseToneOfVoice = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return { content };
};

module.exports = {
  parseBusinessDescription,
  parseCustomers,
  parseSupportFlows,
  parseToneOfVoice,
};