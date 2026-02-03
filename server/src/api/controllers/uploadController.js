const {
  parseBusinessDescription,
  parseCustomers,
  parseSupportFlows,
  parseToneOfVoice,
} = require('../../core/parsers/parsers');
const { setDataStore } = require('./simulationController');

const uploadDocuments = (req, res) => {
  try {
    const parsedData = {};
    req.files.forEach(file => {
      // NOTE: This assumes the files are uploaded in a specific order
      // and are identified by their original names.
      // A more robust solution would involve a dedicated field for each file type.
      if (file.originalname.includes('Bussines description')) {
        parsedData.businessDescription = parseBusinessDescription(file.path);
      } else if (file.originalname.includes('Customers')) {
        parsedData.customers = parseCustomers(file.path);
      } else if (file.originalname.includes('Support Flow')) {
        parsedData.supportFlows = parseSupportFlows(file.path);
      } else if (file.originalname.includes('Tone of Voice')) {
        parsedData.toneOfVoice = parseToneOfVoice(file.path);
      }
    });

    setDataStore(parsedData); // Populate the in-memory store

    res.status(200).json({ message: 'Documents uploaded and parsed successfully', data: parsedData });
  } catch (error) {
    res.status(500).json({ message: 'Error processing documents', error: error.message });
  }
};

module.exports = {
  uploadDocuments,
};