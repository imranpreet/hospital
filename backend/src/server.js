const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const cors = require('cors');
const medicineRoutes = require('./routes/medicines');
const billingRoutes = require('./routes/billing');
const reportsRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const patientRoutes = require('./routes/patients');
const contactRoutes = require('./routes/contact');
const salesRoutes = require('./routes/sales');
const wardRoutes = require('./routes/wards');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Hospital backend running' }));

const PORT = process.env.PORT || 5000;

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
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
