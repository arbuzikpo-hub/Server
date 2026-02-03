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
  
  // Extract flow names from the content
  const flows = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    // Match patterns like "1) Flow Name" or "Flow Name:"
    const flowMatch = line.match(/^\d+\)\s+(.+?)(?:\s+refund request|\s+Refund Request)?(?:\s+\(.*?\))?$/i);
    if (flowMatch) {
      const flowName = flowMatch[1].trim();
      flows.push({
        flow_id: flowName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        flow_name: flowName,
        content: content
      });
    }
  });
  
  // If no flows found, create a default flow
  if (flows.length === 0) {
    flows.push({
      flow_id: 'general_support',
      flow_name: 'General Support',
      content: content
    });
  }
  
  return { flows, content };
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