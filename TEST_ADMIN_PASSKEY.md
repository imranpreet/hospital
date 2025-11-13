# 🧪 Admin Passkey System - Quick Test Guide

## Your Admin Passkey
```
HM@Admin2025$Secure
```

---

## 🎯 Quick Test Steps

### Test 1: Register New Admin ✅
1. Open browser: `http://localhost:5173/admin-register`
2. Fill in:
   - **Name:** Test Admin
   - **Email:** testadmin@hospital.com
   - **Password:** admin123
   - **Passkey:** `HM@Admin2025$Secure`
3. Click "Register as Admin"
4. **Expected:** Success → Redirects to dashboard

### Test 2: Try Wrong Passkey on Registration ❌
1. Open: `http://localhost:5173/admin-register`
2. Fill in details
3. **Passkey:** `WrongPasskey`
4. Click "Register as Admin"
5. **Expected:** Error message "Invalid admin passkey!"

### Test 3: Login with Correct Passkey ✅
1. Open: `http://localhost:5173/admin-login`
2. Enter:
   - **Email:** testadmin@hospital.com
   - **Password:** admin123
   - **Passkey:** `HM@Admin2025$Secure`
3. Click "Admin Sign In"
4. **Expected:** Success → Redirects to dashboard

### Test 4: Trigger Account Blocking 🚫
1. Open: `http://localhost:5173/admin-login`

**Attempt 1:**
- Email: testadmin@hospital.com
- Password: admin123
- Passkey: `Wrong1`
- **Expected:** ⚠️ Orange warning: "2 attempts remaining"

**Attempt 2:**
- Email: testadmin@hospital.com
- Password: admin123
- Passkey: `Wrong2`
- **Expected:** ⚠️ Orange warning: "1 attempt remaining"

**Attempt 3:**
- Email: testadmin@hospital.com
- Password: admin123
- Passkey: `Wrong3`
- **Expected:** 🚫 Red error: "Account blocked!"

**Attempt 4:**
- Try to login again (any passkey)
- **Expected:** 🚫 "Your account has been blocked due to multiple failed passkey attempts"

### Test 5: Unblock Account 🔓

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/unblock-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@hospital.com",
    "adminPasskey": "HM@Admin2025$Secure"
  }'
```

**Expected Response:**
```json
{
  "msg": "Account unblocked successfully",
  "user": {
    "email": "testadmin@hospital.com",
    "name": "Test Admin"
  }
}
```

### Test 6: Login After Unblock ✅
1. Open: `http://localhost:5173/admin-login`
2. Enter credentials with CORRECT passkey
3. **Expected:** Login successful!

---

## 📸 Expected UI States

### 1. Admin Login Page - Normal State
- Email field
- Password field  
- **Passkey field** (new)
- Warning text: "⚠️ You have 3 attempts. Account will be blocked after 3 failed attempts."

### 2. After 1st Wrong Attempt
- Orange warning box appears
- "⚠️ Warning! Incorrect passkey. 2 attempt(s) remaining before account is blocked."

### 3. After 2nd Wrong Attempt
- Orange warning box
- "⚠️ Warning! Incorrect passkey. 1 attempt(s) remaining before account is blocked."

### 4. After 3rd Wrong Attempt (Blocked)
- Red error box with alert icon
- "🚫 Account Blocked! You have entered incorrect passkey 3 times. Please contact system administrator."
- All input fields disabled
- Button shows "Account Blocked" and is disabled

---

## 🔍 Verification in Database

Check MongoDB to see the fields:

```javascript
// Open MongoDB shell or Compass
use your_database_name

// Find the admin user
db.users.findOne({ email: "testadmin@hospital.com" })

// You should see:
{
  _id: ObjectId(...),
  name: "Test Admin",
  email: "testadmin@hospital.com",
  password: "hashed_password",
  role: "admin",
  failedPasskeyAttempts: 0,  // Increments with each wrong attempt
  isBlocked: false,           // Changes to true after 3 attempts
  blockedAt: null,            // Timestamp when blocked
  createdAt: ...,
  updatedAt: ...
}
```

---

## ✅ Success Criteria

- [x] Backend server running on port 5000
- [x] Frontend running on port 5173
- [x] Admin registration requires passkey
- [x] Wrong passkey shows error in registration
- [x] Admin login requires passkey
- [x] First wrong attempt shows warning (2 remaining)
- [x] Second wrong attempt shows warning (1 remaining)
- [x] Third wrong attempt blocks account
- [x] Blocked account cannot login
- [x] Unblock API works with correct passkey
- [x] After unblock, can login again

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Check if backend is running on port 5000
```bash
cd backend
npm start
```

### Issue: "Invalid credentials"
**Solution:** Make sure you're using correct email and password

### Issue: Can't unblock account
**Solution:** Use correct passkey in unblock API:
```bash
curl -X POST http://localhost:5000/api/auth/unblock-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"testadmin@hospital.com","adminPasskey":"HM@Admin2025$Secure"}'
```

### Issue: Passkey field not showing
**Solution:** Clear browser cache and refresh page

---

## 📝 Notes

1. **Passkey is case-sensitive:** `HM@Admin2025$Secure` (exact)
2. **Failed attempts are per user:** Each admin has their own counter
3. **Blocking is permanent:** Until manually unblocked
4. **Regular users unaffected:** This only applies to admin role
5. **Counter resets on success:** Successful login resets failed attempts to 0

---

## 🎉 Done!

Your admin passkey system is now fully functional with:
- ✅ Passkey required for admin registration
- ✅ Passkey required for admin login  
- ✅ 3-strike account blocking system
- ✅ Warning messages before blocking
- ✅ Account unblock functionality
- ✅ Security and audit trail

**Your Passkey:** `HM@Admin2025$Secure`

Keep it safe! 🔐
