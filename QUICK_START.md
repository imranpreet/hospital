# 🚀 Quick Start Guide - Dual Dashboard System

## ⚡ 3-Minute Setup

### **1. Start the Servers**

```bash
# Terminal 1 - Backend
cd "hospital management/backend"
npm run dev

# Terminal 2 - Frontend
cd "hospital management/frontend"
npm run dev
```

**Expected:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173` (or 5174, 5175)

---

### **2. Test Admin Account**

**Step 1: Register Admin**
```
1. Go to: http://localhost:5173/register
2. Fill:
   Name: Admin Test
   Email: admin@test.com
   Password: admin123
   Role: Admin  ← IMPORTANT!
3. Click "Create Account"
4. ✅ Should redirect to: /dashboard
```

**Step 2: Explore Admin Dashboard**
```
✅ See all statistics
✅ Click "All Data" link
✅ Click "Pharmacy" link
✅ Try editing a medicine
```

---

### **3. Test Patient Account**

**Step 1: Logout**
```
1. Click [Logout] button
2. Should return to home/login
```

**Step 2: Register Patient**
```
1. Go to: http://localhost:5173/register
2. Fill:
   Name: Patient Test
   Email: patient@test.com
   Password: patient123
   Role: Patient  ← IMPORTANT!
3. Click "Create Account"
4. ✅ Should redirect to: /patient-dashboard
```

**Step 3: Test Pharmacy View**
```
1. Look for green card "🏥 Pharmacy"
2. Click it
3. ✅ Modal opens
4. ✅ See "View Only" badge
5. Try searching: Type "para"
6. Try filtering: Select "Tablet"
7. ✅ NO edit buttons visible
```

---

### **4. Test Route Protection**

**As Patient:**
```
1. Try visiting: http://localhost:5173/dashboard
2. ✅ Should auto-redirect to: /patient-dashboard
3. Try visiting: http://localhost:5173/pharmacy
4. ✅ Should auto-redirect to: /patient-dashboard
```

**As Admin:**
```
1. Logout as patient
2. Login as admin (admin@test.com)
3. Try visiting: http://localhost:5173/patient-dashboard
4. ✅ Should auto-redirect to: /dashboard
```

---

## 📋 Quick Test Checklist

### **Admin Tests:**
- [ ] Can register with role "Admin"
- [ ] Redirected to `/dashboard` after login
- [ ] Can see "All Data" section
- [ ] Can access `/pharmacy` page
- [ ] Can add/edit/delete medicines
- [ ] Cannot access `/patient-dashboard`
- [ ] Auto-redirected if try to access patient dashboard

### **Patient Tests:**
- [ ] Can register with role "Patient"
- [ ] Redirected to `/patient-dashboard` after login
- [ ] Can see pharmacy button (green card)
- [ ] Pharmacy modal opens when clicked
- [ ] Shows "View Only" badge
- [ ] Can search medicines
- [ ] Can filter by category
- [ ] NO edit/delete buttons in pharmacy
- [ ] NO "All Data" section visible
- [ ] Cannot access `/dashboard`
- [ ] Auto-redirected if try to access admin dashboard

---

## 🎯 Expected Behavior Summary

### **Login Flow:**

| User Role | Login → | Can Access | Cannot Access |
|-----------|---------|------------|---------------|
| Admin | /dashboard | /dashboard, /pharmacy, /all-data | /patient-dashboard |
| Patient | /patient-dashboard | /patient-dashboard | /dashboard, /pharmacy, /all-data |
| Doctor | /patient-dashboard | /patient-dashboard | /dashboard, /pharmacy, /all-data |

---

## 🔍 Troubleshooting

### **Issue: Redirects not working**
**Solution:**
```javascript
// Check token in browser console:
localStorage.getItem('token')

// If no token, login again
// If wrong role, logout and register with correct role
```

### **Issue: Pharmacy modal not showing medicines**
**Solution:**
```bash
# Make sure backend is running
cd backend
npm run dev

# Check if medicines exist in database
# If not, seed medicines:
node src/seedMedicines.js
```

### **Issue: "Cannot access /dashboard" even as admin**
**Solution:**
```javascript
// Clear localStorage and re-login
localStorage.clear()
// Then register/login again
```

---

## 📸 Visual Confirmation

### **Admin Dashboard Should Look Like:**
```
┌────────────────────────────────────────┐
│  🏥 Live Dashboard                     │
│  [All Data] [Pharmacy] Links visible  │
│  Multiple charts and graphs            │
│  Edit/Delete buttons everywhere        │
└────────────────────────────────────────┘
```

### **Patient Dashboard Should Look Like:**
```
┌────────────────────────────────────────┐
│  Welcome back, Patient Test! 👋       │
│  [Search Doctor box]                   │
│  ┌───────────────────────────┐        │
│  │ 🏥 Pharmacy               │        │
│  │ View available medicines  │        │
│  │ [Click to open]           │        │
│  └───────────────────────────┘        │
│  NO "All Data" link                   │
│  NO Edit buttons                       │
└────────────────────────────────────────┘
```

### **Patient Pharmacy Modal Should Look Like:**
```
┌────────────────────────────────────────┐
│  🏥 Pharmacy - Medicines Catalog       │
│  📖 View Only • No editing allowed [X] │
├────────────────────────────────────────┤
│  [🔍 Search] [Category ▼]             │
│  Medicine  Stock  Price  Status        │
│  Para      500    ₹5     Available    │
│  ❌ NO Add/Edit/Delete buttons        │
└────────────────────────────────────────┘
```

---

## ⏱️ 30-Second Quick Test

**Admin:**
```
1. Register as Admin → Should go to /dashboard ✅
2. See "All Data" and "Pharmacy" links ✅
3. Can edit medicines ✅
```

**Patient:**
```
1. Register as Patient → Should go to /patient-dashboard ✅
2. Click green pharmacy button ✅
3. Modal opens with "View Only" badge ✅
4. NO edit buttons ✅
```

---

## 🎉 Success Indicators

### **You know it's working when:**

✅ Admin goes to `/dashboard` after login
✅ Patient goes to `/patient-dashboard` after login
✅ Admin sees full pharmacy management page
✅ Patient sees read-only pharmacy modal
✅ Patient CANNOT see "All Data" section
✅ Patient CANNOT see edit/delete buttons
✅ Auto-redirects work (wrong role → correct dashboard)
✅ No console errors
✅ Search and filter work in patient pharmacy view

---

## 📞 Support

If something doesn't work:

1. **Check Console:** Press F12 → Console tab
2. **Check Network:** F12 → Network tab
3. **Clear Storage:** F12 → Application → Clear storage
4. **Restart Servers:** Stop both servers, start again
5. **Check Role:** `localStorage.getItem('token')` → decode at jwt.io

---

## 🎊 That's It!

**You now have a fully functional dual-dashboard system!**

**Admin Dashboard** = Full control (can edit everything)
**Patient Dashboard** = Safe view (read-only pharmacy)

**Test URLs:**
- http://localhost:5173/login
- http://localhost:5173/register
- http://localhost:5173/dashboard (admin)
- http://localhost:5173/patient-dashboard (patient)

**Enjoy! 🏥✨**
