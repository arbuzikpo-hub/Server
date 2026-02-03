const { runSimulation } = require('../../core/simulators/simulation');
const { validateFlow } = require('../../core/validators/validator');

// In-memory store for uploaded data (for MVP)
const dataStore = {};

const run = async (req, res) => {
  try {
    const { personaId, flowId } = req.body;

    // This is a simplified data fetching logic.
    // In a real application, this data would be stored in the database
    // after the initial upload and parsing.
    const persona = dataStore.customers.find(c => c.ID === personaId);
    const supportFlow = dataStore.supportFlows.find(f => f.flow_id === flowId);
    const businessContext = dataStore.businessDescription;
    const toneOfVoice = dataStore.toneOfVoice;

    if (!persona || !supportFlow) {
      return res.status(404).json({ message: 'Persona or Support Flow not found.' });
    }

    const conversation = await runSimulation(persona, supportFlow, businessContext, toneOfVoice);
    const validationResults = await validateFlow(conversation, supportFlow);

    res.status(200).json({ conversation, validationResults });
  } catch (error) {
    res.status(500).json({ message: 'Error running simulation', error: error.message });
  }
};

// This function is for populating the in-memory datastore after upload.
// It will be called from the uploadController.
const setDataStore = (data) => {
  Object.assign(dataStore, data);
};

module.exports = {
  run,
  setDataStore,
};