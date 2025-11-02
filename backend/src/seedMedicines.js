const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./models/Medicine');

dotenv.config();

const sampleMedicines = [
  {
    name: 'Paracetamol 500mg',
    category: 'Tablet',
    pricePerUnit: 2.5,
    stockQuantity: 500,
    minimumRequired: 100,
    manufacturer: 'PharmaCo Ltd',
    supplier: 'MedSupply Inc',
    batchNumber: 'PC2024001',
    purchaseDate: new Date('2024-01-15'),
    expiryDate: new Date('2026-12-31'),
    description: 'Pain relief and fever reducer',
    rackNumber: 'A-01',
    addedBy: 'Admin',
    salesCount: 145,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Amoxicillin 250mg',
    category: 'Capsule',
    pricePerUnit: 8.5,
    stockQuantity: 300,
    minimumRequired: 80,
    manufacturer: 'HealthCare Pharma',
    supplier: 'Global Med Supply',
    batchNumber: 'AM2024002',
    purchaseDate: new Date('2024-02-10'),
    expiryDate: new Date('2026-06-30'),
    description: 'Antibiotic for bacterial infections',
    rackNumber: 'B-12',
    addedBy: 'Admin',
    salesCount: 98,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80'
  },
  {
    name: 'Cough Syrup 100ml',
    category: 'Syrup',
    pricePerUnit: 125.0,
    stockQuantity: 150,
    minimumRequired: 50,
    manufacturer: 'Natural Remedies',
    supplier: 'PharmaDirect',
    batchNumber: 'CS2024003',
    purchaseDate: new Date('2024-03-05'),
    expiryDate: new Date('2025-11-15'),
    description: 'Relief from cough and cold',
    rackNumber: 'C-05',
    addedBy: 'Admin',
    salesCount: 67,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80'
  },
  {
    name: 'Insulin Injection 100IU',
    category: 'Injection',
    pricePerUnit: 450.0,
    stockQuantity: 80,
    minimumRequired: 30,
    manufacturer: 'DiabetesCare Inc',
    supplier: 'Medical Supplies Co',
    batchNumber: 'IN2024004',
    purchaseDate: new Date('2024-04-20'),
    expiryDate: new Date('2026-03-31'),
    description: 'Insulin for diabetes management',
    rackNumber: 'D-08',
    addedBy: 'Admin',
    salesCount: 43,
    image: 'https://images.unsplash.com/photo-1579154204845-72d0b6eb4e4f?w=400&q=80'
  },
  {
    name: 'Omeprazole 20mg',
    category: 'Tablet',
    pricePerUnit: 5.0,
    stockQuantity: 400,
    minimumRequired: 100,
    manufacturer: 'GastroPharma',
    supplier: 'MedSupply Inc',
    batchNumber: 'OM2024005',
    purchaseDate: new Date('2024-05-12'),
    expiryDate: new Date('2026-09-30'),
    description: 'Treats acid reflux and ulcers',
    rackNumber: 'A-15',
    addedBy: 'Admin',
    salesCount: 112,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Vitamin D3 Drops',
    category: 'Drops',
    pricePerUnit: 85.0,
    stockQuantity: 120,
    minimumRequired: 40,
    manufacturer: 'Wellness Labs',
    supplier: 'Health Distribution',
    batchNumber: 'VD2024006',
    purchaseDate: new Date('2024-06-08'),
    expiryDate: new Date('2026-08-15'),
    description: 'Vitamin D supplement for bone health',
    rackNumber: 'E-03',
    addedBy: 'Admin',
    salesCount: 54,
    image: 'https://images.unsplash.com/photo-1550572017-4870c4baa0de?w=400&q=80'
  },
  {
    name: 'Eye Drops Refresh',
    category: 'Drops',
    pricePerUnit: 95.0,
    stockQuantity: 90,
    minimumRequired: 30,
    manufacturer: 'OptiCare',
    supplier: 'Vision Supplies',
    batchNumber: 'ED2024007',
    purchaseDate: new Date('2024-07-15'),
    expiryDate: new Date('2025-12-31'),
    description: 'Relieves dry and irritated eyes',
    rackNumber: 'F-06',
    addedBy: 'Admin',
    salesCount: 38,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80'
  },
  {
    name: 'Antiseptic Cream 50g',
    category: 'Ointment',
    pricePerUnit: 65.0,
    stockQuantity: 200,
    minimumRequired: 60,
    manufacturer: 'DermaCare',
    supplier: 'PharmaDirect',
    batchNumber: 'AC2024008',
    purchaseDate: new Date('2024-08-10'),
    expiryDate: new Date('2026-07-31'),
    description: 'Prevents infection in minor cuts',
    rackNumber: 'G-09',
    addedBy: 'Admin',
    salesCount: 76,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80'
  },
  {
    name: 'Cetirizine 10mg',
    category: 'Tablet',
    pricePerUnit: 3.0,
    stockQuantity: 450,
    minimumRequired: 120,
    manufacturer: 'AllergyFree Pharma',
    supplier: 'Global Med Supply',
    batchNumber: 'CT2024009',
    purchaseDate: new Date('2024-09-05'),
    expiryDate: new Date('2026-10-31'),
    description: 'Antihistamine for allergies',
    rackNumber: 'A-22',
    addedBy: 'Admin',
    salesCount: 89,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  {
    name: 'Multivitamin Capsules',
    category: 'Capsule',
    pricePerUnit: 12.0,
    stockQuantity: 350,
    minimumRequired: 80,
    manufacturer: 'Wellness Labs',
    supplier: 'Health Distribution',
    batchNumber: 'MV2024010',
    purchaseDate: new Date('2024-10-01'),
    expiryDate: new Date('2027-02-28'),
    description: 'Daily multivitamin supplement',
    rackNumber: 'B-18',
    addedBy: 'Admin',
    salesCount: 124,
    image: 'https://images.unsplash.com/photo-1550572017-4870c4baa0de?w=400&q=80'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing medicines
    const deleteResult = await Medicine.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing medicines`);

    // Add medicineId to each medicine
    const medicinesWithIds = sampleMedicines.map((med, index) => ({
      ...med,
      medicineId: `MED${(index + 1).toString().padStart(6, '0')}`
    }));

    // Insert sample medicines
    const result = await Medicine.insertMany(medicinesWithIds);
    console.log(`✅ Successfully added ${result.length} medicines to database`);
    
    console.log('\n📋 Added Medicines:');
    result.forEach((med, index) => {
      console.log(`${index + 1}. ${med.medicineId} - ${med.name} (${med.category}) - Stock: ${med.stockQuantity} - Price: ₹${med.pricePerUnit}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
