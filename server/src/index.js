require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const uploadRoutes = require('./api/routes/upload');
const simulationRoutes = require('./api/routes/simulation');
const exportRoutes = require('./api/routes/export');

app.use('/upload', uploadRoutes);
app.use('/simulation', simulationRoutes);
app.use('/export', exportRoutes);

app.get('/', (req, res) => {
  res.send('SFRTE Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});