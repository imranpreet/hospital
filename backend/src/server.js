const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const medicineRoutes = require('./routes/medicines');
const billingRoutes = require('./routes/billing');
const reportsRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const patientRoutes = require('./routes/patients');
const contactRoutes = require('./routes/contact');
const salesRoutes = require('./routes/sales');
const wardRoutes = require('./routes/wards');
const aiModule = require('./routes/ai');
const aiRoutes = aiModule;
const geminiRoutes = aiModule.geminiRouter;
const groqRoutes = aiModule.groqRouter;
const projectRoutes = require('./routes/projects');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Hospital backend running' }));

const PORT = process.env.PORT || 5000;

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`ERROR: Port ${PORT} is already in use.`);
      console.error(`Stop the existing backend first, then run: npm start`);
      console.error(`Linux check: ss -ltnp 'sport = :${PORT}'`);
    } else {
      console.error('Backend server error:', error);
    }
    process.exit(1);
  });
}

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set. Please set MONGODB_URI in backend/.env to a MongoDB connection string (MongoDB Atlas or local).');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
