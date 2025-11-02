const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./src/models/Room');
const Bed = require('./src/models/Bed');

dotenv.config();

const seedRooms = [
  // ICU Rooms
  { roomNumber: 'ICU-101', roomType: 'ICU', floor: 1, capacity: 4, pricePerDay: 5000, amenities: ['Ventilator', '24/7 Monitoring', 'Emergency Equipment'] },
  { roomNumber: 'ICU-102', roomType: 'ICU', floor: 1, capacity: 4, pricePerDay: 5000, amenities: ['Ventilator', '24/7 Monitoring', 'Emergency Equipment'] },
  
  // General Wards
  { roomNumber: 'G-201', roomType: 'General', floor: 2, capacity: 6, pricePerDay: 1000, amenities: ['Fan', 'Shared Bathroom'] },
  { roomNumber: 'G-202', roomType: 'General', floor: 2, capacity: 6, pricePerDay: 1000, amenities: ['Fan', 'Shared Bathroom'] },
  { roomNumber: 'G-203', roomType: 'General', floor: 2, capacity: 6, pricePerDay: 1000, amenities: ['Fan', 'Shared Bathroom'] },
  
  // Private Rooms
  { roomNumber: 'P-301', roomType: 'Private', floor: 3, capacity: 1, pricePerDay: 3000, amenities: ['AC', 'TV', 'Private Bathroom', 'Refrigerator'] },
  { roomNumber: 'P-302', roomType: 'Private', floor: 3, capacity: 1, pricePerDay: 3000, amenities: ['AC', 'TV', 'Private Bathroom', 'Refrigerator'] },
  { roomNumber: 'P-303', roomType: 'Private', floor: 3, capacity: 1, pricePerDay: 3000, amenities: ['AC', 'TV', 'Private Bathroom', 'Refrigerator'] },
  { roomNumber: 'P-304', roomType: 'Private', floor: 3, capacity: 1, pricePerDay: 3000, amenities: ['AC', 'TV', 'Private Bathroom', 'Refrigerator'] },
  
  // Emergency Room
  { roomNumber: 'ER-001', roomType: 'Emergency', floor: 0, capacity: 10, pricePerDay: 2000, amenities: ['Emergency Equipment', '24/7 Staff'] },
  
  // Maternity Ward
  { roomNumber: 'M-401', roomType: 'Maternity', floor: 4, capacity: 4, pricePerDay: 2500, amenities: ['Baby Warmer', 'Private Nursing', 'AC'] },
  { roomNumber: 'M-402', roomType: 'Maternity', floor: 4, capacity: 4, pricePerDay: 2500, amenities: ['Baby Warmer', 'Private Nursing', 'AC'] },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Room.deleteMany({});
    await Bed.deleteMany({});
    console.log('Cleared existing rooms and beds');
    
    // Create rooms and beds
    for (const roomData of seedRooms) {
      const room = new Room({
        ...roomData,
        availableBeds: roomData.capacity
      });
      
      await room.save();
      console.log(`✓ Created room: ${room.roomNumber}`);
      
      // Create beds for this room
      const beds = [];
      for (let i = 1; i <= room.capacity; i++) {
        const bed = new Bed({
          bedNumber: `${room.roomNumber}-B${i}`,
          room: room._id,
          status: 'Available'
        });
        beds.push(bed);
      }
      
      await Bed.insertMany(beds);
      console.log(`  ✓ Created ${beds.length} beds for ${room.roomNumber}`);
    }
    
    console.log('\n✅ Database seeded successfully!');
    console.log(`📊 Total Rooms: ${seedRooms.length}`);
    console.log(`🛏️  Total Beds: ${seedRooms.reduce((sum, r) => sum + r.capacity, 0)}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
