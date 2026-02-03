const { runSimulation } = require('../../core/simulators/simulation');
const { validateFlow } = require('../../core/validators/validator');

// In-memory store for uploaded data (for MVP)
const dataStore = {};

const run = async (req, res) => {
  try {
    const { flowId, testCount = 1 } = req.body;

    // Validate data store
    if (!dataStore.customers || dataStore.customers.length === 0) {
      return res.status(400).json({ message: 'No customer personas available. Please upload customer data first.' });
    }

    if (!dataStore.supportFlows || !dataStore.supportFlows.flows || dataStore.supportFlows.flows.length === 0) {
      return res.status(400).json({ message: 'No support flows available. Please upload support flow data first.' });
    }

    // Find the selected flow
    const supportFlow = dataStore.supportFlows.flows.find(f => f.flow_id === flowId);
    if (!supportFlow) {
      return res.status(404).json({ message: 'Support Flow not found.' });
    }

    const businessContext = dataStore.businessDescription;
    const toneOfVoice = dataStore.toneOfVoice;

    // Run multiple simulations with random personas
    const results = [];
    for (let i = 0; i < testCount; i++) {
      // Randomly select a persona
      const randomIndex = Math.floor(Math.random() * dataStore.customers.length);
      const persona = dataStore.customers[randomIndex];

      const conversation = await runSimulation(persona, supportFlow, businessContext, toneOfVoice);
      const validationResults = await validateFlow(conversation, supportFlow);

      results.push({
        testNumber: i + 1,
        persona: {
          id: persona.ID,
          name: persona.Name,
          age: persona.Age,
          location: persona.Location,
          tone: persona['Tone of Voice'],
          attitude: persona.Attitude
        },
        conversation,
        validationResults
      });
    }

    res.status(200).json({
      flowId,
      flowName: supportFlow.flow_name,
      testCount,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Error running simulation', error: error.message });
  }
};

// Get available flows for the frontend
const getFlows = (req, res) => {
  try {
    if (!dataStore.supportFlows || !dataStore.supportFlows.flows) {
      return res.status(400).json({ message: 'No support flows available. Please upload support flow data first.' });
    }

    const flows = dataStore.supportFlows.flows.map(f => ({
      flow_id: f.flow_id,
      flow_name: f.flow_name
    }));

    res.status(200).json({ flows });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flows', error: error.message });
  }
};

// Get available personas for display purposes
const getPersonas = (req, res) => {
  try {
    if (!dataStore.customers || dataStore.customers.length === 0) {
      return res.status(400).json({ message: 'No customer personas available. Please upload customer data first.' });
    }

    const personas = dataStore.customers.map(c => ({
      id: c.ID,
      name: c.Name,
      age: c.Age,
      location: c.Location,
      tone: c['Tone of Voice'],
      attitude: c.Attitude
    }));

    res.status(200).json({ personas, count: personas.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personas', error: error.message });
  }
};

// This function is for populating the in-memory datastore after upload.
// It will be called from the uploadController.
const setDataStore = (data) => {
  Object.assign(dataStore, data);
};

module.exports = {
  run,
  getFlows,
  getPersonas,
  setDataStore,
};