# Ward & Bed Management System Documentation

## 🏥 Overview
Complete hospital Ward and Bed Management module with automatic bed assignment, discharge process, and real-time dashboard.

## 📋 Features Implemented

### 1. Database Models
✅ **Room Model** (`backend/src/models/Room.js`)
- roomNumber (unique)
- roomType (ICU, General, Private, Emergency, Maternity)
- floor, capacity
- occupiedBeds, availableBeds
- pricePerDay
- amenities
- status (Active/Maintenance/Closed)

✅ **Bed Model** (`backend/src/models/Bed.js`)
- bedNumber (unique)
- room (reference to Room)
- status (Available/Occupied/Maintenance/Reserved)
- patient (reference to Patient, nullable)
- assignedDate, dischargeDate
- notes

✅ **Updated Patient Model** (`backend/src/models/Patient.js`)
- admissionStatus (Admitted/Discharged/Outpatient)
- bed, room (references)
- admissionDate, dischargeDate
- admissionReason
- totalBill

### 2. Backend API Routes (`backend/src/routes/wards.js`)

#### GET `/api/wards/rooms`
- Get all rooms with filters (roomType, status)
- Returns room details with occupancy

#### POST `/api/wards/rooms`
- Create new room
- Automatically creates beds based on capacity

#### GET `/api/wards/beds`
- Get all beds with filters (roomType, status, roomId)
- Populates room and patient details

#### GET `/api/wards/stats`
- Dashboard statistics:
  - Total, occupied, available, maintenance beds
  - Occupancy rate
  - Beds by room type
  - Recent admissions

#### POST `/api/wards/admit`
- **Automatic Bed Assignment**
- Finds first available bed in selected room type
- Updates bed status to "Occupied"
- Links patient to bed
- Updates room occupancy counts
- Returns error if no beds available

#### POST `/api/wards/discharge`
- Discharge patient
- Frees bed (status = "Available")
- Clears patient_id from bed
- Updates room occupancy
- Calculates total bill based on days stayed
- Updates patient status to "Discharged"

#### GET `/api/wards/search`
- Search beds by bed number
- Search patients by name
- Returns matching results

#### PUT `/api/wards/beds/:bedId`
- Update bed status (for maintenance)
- Cannot change occupied bed status

### 3. Frontend Pages

#### `/wards` - Ward Management Dashboard
**File:** `frontend/src/pages/WardManagement.jsx`

**Features:**
- 📊 Statistics Cards:
  - Total Beds
  - Occupied Beds (with occupancy rate)
  - Available Beds
  - Maintenance Beds

- 📈 Occupancy Chart by Room Type
  - Visual bars showing occupied/total for each room type
  - Color-coded by room type

- 🔍 Search & Filters:
  - Search by bed number or patient name
  - Filter by room type (All, ICU, General, Private, Emergency, Maternity)
  - Filter by bed status (All, Available, Occupied, Maintenance, Reserved)

- 🛏️ Beds Table:
  - Bed Number
  - Room Type (color-coded badges)
  - Room Number
  - Status (with emoji indicators: 🟢 Available, 🔴 Occupied, 🟡 Maintenance)
  - Patient Name (if assigned)
  - Admission Date
  - Discharge button for occupied beds

- ✨ Design:
  - Gradient background
  - Glass morphism cards
  - Smooth animations (Framer Motion)
  - Responsive layout

#### `/wards/admit` - Admit Patient
**File:** `frontend/src/pages/AdmitPatient.jsx`

**Features:**
- Select patient from dropdown (only non-admitted patients)
- Patient details preview
- Room type selection (clickable cards with icons)
- Admission reason textarea
- Optional doctor assignment
- Automatic bed assignment info box
- Success notification with:
  - Patient name
  - Assigned bed number
  - Room details
  - Admission timestamp
- Sound notification on success
- Error handling with suggestions

#### `/wards/discharge/:patientId` - Discharge Patient
**File:** `frontend/src/pages/DischargePatient.jsx`

**Features:**
- Patient information display:
  - Name, age, gender, contact
  - Admission status, date
  - Bed and room details
  - Room price per day
- Discharge summary textarea
- Estimated bill preview:
  - Days stayed calculation
  - Room charges
  - Total amount
- Success notification with:
  - Days stayed
  - Total bill
  - Discharge timestamp
- Links to view dashboard or generate bill
- Sound notification on success

### 4. Seeded Data
**File:** `backend/seedWards.js`

Populated database with:
- **12 Rooms:**
  - 2 ICU rooms (4 beds each) - ₹5,000/day
  - 3 General wards (6 beds each) - ₹1,000/day
  - 4 Private rooms (1 bed each) - ₹3,000/day
  - 1 Emergency room (10 beds) - ₹2,000/day
  - 2 Maternity wards (4 beds each) - ₹2,500/day

- **48 Total Beds:**
  - All marked as "Available" initially
  - Unique bed numbers (e.g., ICU-101-B1, G-201-B1)

## 🎨 Design Features

### Color Coding
- **Room Types:**
  - ICU: Red (`bg-red-500`)
  - General: Blue (`bg-blue-500`)
  - Private: Purple (`bg-purple-500`)
  - Emergency: Orange (`bg-orange-500`)
  - Maternity: Pink (`bg-pink-500`)

- **Bed Status:**
  - Available: Green with 🟢
  - Occupied: Red with 🔴
  - Maintenance: Yellow with 🟡
  - Reserved: Blue with 🔵

### Animations
- Card entrance animations (Framer Motion)
- Hover effects on clickable elements
- Progress bars for occupancy
- Loading spinners
- Smooth transitions

### Responsive Design
- Grid layouts for statistics
- Responsive tables
- Mobile-friendly filters
- Touch-friendly buttons

## 🔔 Notifications

### Sound Alerts
- Plays notification sound on:
  - Successful admission
  - Successful discharge
- Uses Mixkit audio library
- Fallback to browser notifications

### Browser Notifications
- Requests permission automatically
- Shows desktop notifications
- Includes patient and room details

## 🚀 How to Use

### 1. Setup
```bash
# Backend
cd backend
npm install
node seedWards.js  # Seed rooms and beds
npm start  # Runs on port 5000

# Frontend
cd frontend
npm install
npm run dev  # Runs on port 5173/5174
```

### 2. Access Ward Management
1. Login as admin at `/admin-login`
2. Click "Wards" in navigation header
3. View dashboard with statistics and bed list

### 3. Admit Patient
1. Click "Admit Patient" button
2. Select patient from dropdown
3. Choose room type
4. Add admission reason (optional)
5. Assign doctor (optional)
6. Click "Admit Patient"
7. System automatically finds and assigns first available bed

### 4. Discharge Patient
1. In ward dashboard, find occupied bed
2. Click "Discharge" button
3. Review patient details
4. Add discharge summary (optional)
5. Review estimated bill
6. Click "Discharge Patient"
7. Bed becomes available automatically

### 5. Search & Filter
- Use search bar to find beds or patients
- Select room type filter
- Select status filter
- Results update automatically

## 📊 Dashboard Statistics

### Real-time Updates
- Total beds count
- Occupied beds count
- Available beds count
- Maintenance beds count
- Occupancy rate percentage
- Beds by room type (with visual charts)
- Recent admissions list

### Visual Indicators
- Progress bars for occupancy
- Color-coded status badges
- Icons for each category
- Animated charts

## 🔧 Technical Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React + Vite
- React Router
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS (styling)

## 🎯 Key Functionalities

### ✅ Automatic Bed Assignment
- System finds first available bed in selected room type
- Updates bed status immediately
- Links patient to bed
- Updates room occupancy counts
- Shows error if no beds available

### ✅ Discharge Process
- One-click discharge
- Automatic bed release
- Bill calculation (days × room price)
- Room availability update
- Patient status update

### ✅ Real-time Dashboard
- Live bed status updates
- Occupancy tracking
- Room-wise statistics
- Patient admission history

### ✅ Search Functionality
- Search beds by number
- Search patients by name
- Quick access to patient records

### ✅ Filter Options
- Filter by room type
- Filter by bed status
- Combined filters
- Clear filter options

## 🎨 Aesthetic Features

- Gradient backgrounds
- Glass morphism design
- Smooth animations
- Color-coded information
- Professional medical theme
- Responsive layouts
- Interactive elements
- Hover effects
- Loading states
- Success/error messages
- Sound notifications

## 📱 Navigation

- Header link to Wards (admin only)
- Back buttons in all subpages
- Quick actions in dashboard
- Breadcrumb navigation
- Clear call-to-action buttons

## 🔒 Security

- JWT authentication required
- Admin-only access
- Token validation
- Protected routes
- Secure API endpoints

## 🎊 Success!

All requirements have been successfully implemented:
✅ Room, Bed, Patient models
✅ Automatic bed assignment
✅ Discharge process
✅ Dashboard with statistics
✅ Color-coded status indicators
✅ Search functionality
✅ Filter options
✅ Real-time updates
✅ Occupancy charts
✅ Aesthetic design
✅ Sound notifications
✅ Fully workable system

## 📍 URLs

- Ward Dashboard: `http://localhost:5174/wards`
- Admit Patient: `http://localhost:5174/wards/admit`
- Discharge Patient: `http://localhost:5174/wards/discharge/:patientId`

---

## 🎉 Complete System Ready!
Your Ward & Bed Management System is now fully functional and ready to use!
