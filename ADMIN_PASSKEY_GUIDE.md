# Admin Passkey System - Complete Guide

## 🔐 Admin Passkey
**Passkey:** `HM@Admin2025$Secure`

---

## ✨ Features Implemented

### 1. **Admin Registration with Passkey**
- Admin registration now requires the correct passkey
- Without the correct passkey, registration will fail
- Location: `/admin-register`

### 2. **Admin Login with Passkey**
- All admin logins require email, password, AND passkey
- Three-strike rule implemented
- Location: `/admin-login`

### 3. **Three-Strike Account Blocking**
- ❌ **1st Wrong Attempt:** Warning - 2 attempts remaining
- ❌ **2nd Wrong Attempt:** Warning - 1 attempt remaining  
- ❌ **3rd Wrong Attempt:** Account BLOCKED permanently

### 4. **Account Unblock API**
- System administrators can unblock accounts using the passkey
- Endpoint: `POST /api/auth/unblock-admin`

---

## 📋 How It Works

### Admin Registration Flow
1. User goes to Admin Registration page
2. Enters: Name, Email, Password, **Passkey**
3. System verifies passkey = `HM@Admin2025$Secure`
4. If correct → Account created ✅
5. If wrong → Registration denied ❌

### Admin Login Flow
1. User goes to Admin Login page
2. Enters: Email, Password, **Passkey**
3. System checks:
   - Is account blocked? → Show blocked message
   - Is password correct? → Verify passkey
   - Is passkey correct? → Login successful
   - Is passkey wrong? → Increment failed attempts
4. After 3 failed passkey attempts → Account BLOCKED

### Account States
- **Normal:** 0 failed attempts, can login
- **Warning:** 1-2 failed attempts, warning shown
- **Blocked:** 3+ failed attempts, cannot login

---

## 🔧 API Endpoints

### 1. Admin Registration
```bash
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "admin@hospital.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Admin Login
```bash
POST /api/auth/admin-login
Body: {
  "email": "admin@hospital.com",
  "password": "password123",
  "passkey": "HM@Admin2025$Secure"
}
```

### 3. Unblock Admin Account
```bash
POST /api/auth/unblock-admin
Body: {
  "email": "admin@hospital.com",
  "adminPasskey": "HM@Admin2025$Secure"
}
```

---

## 🧪 Testing Scenarios

### Test 1: Successful Admin Registration
1. Go to `/admin-register`
2. Fill all fields with valid data
3. Enter passkey: `HM@Admin2025$Secure`
4. Click "Register as Admin"
5. ✅ Should redirect to dashboard

### Test 2: Failed Registration (Wrong Passkey)
1. Go to `/admin-register`
2. Fill all fields
3. Enter wrong passkey: `WrongPasskey123`
4. Click "Register as Admin"
5. ❌ Should show error message

### Test 3: Successful Admin Login
1. Go to `/admin-login`
2. Enter valid email and password
3. Enter correct passkey: `HM@Admin2025$Secure`
4. Click "Admin Sign In"
5. ✅ Should redirect to dashboard

### Test 4: Account Blocking (3 Wrong Attempts)

**Attempt 1:**
- Email: admin@hospital.com
- Password: correct_password
- Passkey: WrongKey1
- Result: ⚠️ "Incorrect passkey. 2 attempt(s) remaining"

**Attempt 2:**
- Email: admin@hospital.com
- Password: correct_password
- Passkey: WrongKey2
- Result: ⚠️ "Incorrect passkey. 1 attempt(s) remaining"

**Attempt 3:**
- Email: admin@hospital.com
- Password: correct_password
- Passkey: WrongKey3
- Result: 🚫 "Account blocked! Contact system administrator"

**Attempt 4+:**
- Any login attempt
- Result: 🚫 "Your account has been blocked due to multiple failed passkey attempts"

---

## 🛡️ Security Features

1. **Passkey Stored as Environment Variable**
   - Not hardcoded in multiple places
   - Easy to change if compromised
   - Location: `ADMIN_PASSKEY` in backend

2. **Failed Attempt Tracking**
   - Stored in database per user
   - Reset to 0 on successful login
   - Persistent across server restarts

3. **Account Blocking**
   - Permanent until manually unblocked
   - Prevents brute force attacks
   - Requires admin intervention to unblock

4. **Separation of Concerns**
   - Regular users cannot access admin login
   - Admins cannot login through regular login portal
   - Different routes: `/auth/login` vs `/auth/admin-login`

---

## 🔓 Unblocking an Admin Account

### Method 1: Using API (Postman/cURL)
```bash
curl -X POST http://localhost:5000/api/auth/unblock-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "blocked-admin@hospital.com",
    "adminPasskey": "HM@Admin2025$Secure"
  }'
```

### Method 2: Using MongoDB Directly
```javascript
// Connect to MongoDB
use hospital_db

// Unblock specific admin
db.users.updateOne(
  { email: "blocked-admin@hospital.com" },
  { 
    $set: { 
      isBlocked: false, 
      failedPasskeyAttempts: 0,
      blockedAt: null 
    } 
  }
)
```

---

## 📊 Database Schema Changes

### User Model Updates
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // 'admin', 'doctor', 'patient', 'staff'
  
  // NEW FIELDS
  failedPasskeyAttempts: Number (default: 0),
  isBlocked: Boolean (default: false),
  blockedAt: Date
}
```

---

## 🚀 Deployment Notes

### Environment Variables
Add to `.env` file:
```env
ADMIN_PASSKEY=HM@Admin2025$Secure
JWT_SECRET=your-jwt-secret-here
MONGODB_URI=your-mongodb-connection-string
```

### Starting the Server
```bash
cd backend
npm install
npm start
```

### Starting the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## ⚠️ Important Notes

1. **Change Default Passkey:** In production, change `HM@Admin2025$Secure` to a more secure, random string
2. **Keep Passkey Secret:** Never commit passkey to version control
3. **Monitor Failed Attempts:** Set up alerts for blocked accounts
4. **Regular Audits:** Review blocked accounts regularly
5. **Backup Access:** Keep a super admin account that cannot be blocked

---

## 🔗 Related Files

### Backend
- `/backend/src/models/User.js` - User schema with new fields
- `/backend/src/routes/auth.js` - Auth routes with passkey logic

### Frontend
- `/frontend/src/pages/AdminLogin.jsx` - Admin login with passkey
- `/frontend/src/pages/AdminRegister.jsx` - Admin registration with passkey

---

## 📞 Support

If an admin account gets blocked:
1. Use the unblock API endpoint with correct passkey
2. Or manually update database
3. Or contact system administrator

**System Administrator Passkey:** `HM@Admin2025$Secure`

---

## ✅ Testing Checklist

- [ ] Admin can register with correct passkey
- [ ] Admin cannot register with wrong passkey
- [ ] Admin can login with correct passkey
- [ ] Warning shown on first wrong passkey attempt
- [ ] Warning shown on second wrong passkey attempt
- [ ] Account blocked on third wrong passkey attempt
- [ ] Blocked account cannot login
- [ ] Account can be unblocked via API
- [ ] Regular users cannot access admin login
- [ ] Failed attempts reset after successful login

---

**Last Updated:** November 11, 2025
**Version:** 1.0.0
