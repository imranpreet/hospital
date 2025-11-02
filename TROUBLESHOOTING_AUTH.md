# Authentication Troubleshooting Guide

## Current Status
✅ Backend is running on `http://localhost:5000`
✅ Frontend is running on `http://localhost:5173`
✅ Backend API endpoints are working (tested with curl)
✅ No compilation errors in the code

## Potential Issues & Solutions

### Issue 1: "Missing dependency in useEffect" Warning
**Fixed**: Added `navigate` to the dependency array in Appointment.jsx

### Issue 2: CORS Errors
**Check**: Open browser console (F12) and look for CORS errors
**Solution**: Backend already has `app.use(cors())` enabled, so this should work

### Issue 3: Network Request Failures
**Symptoms**: 
- "Network Error" in console
- Failed to fetch
- ERR_CONNECTION_REFUSED

**Solutions**:
1. Verify backend is running: `curl http://localhost:5000/api/auth/login`
2. Check if `.env` file has correct API URL in frontend
3. Make sure VITE_API_URL=http://localhost:5000/api

### Issue 4: Infinite Redirect Loop
**Symptoms**: Page keeps redirecting between login and appointment
**Solution**: The code now properly handles this:
- Only redirects if no token found
- Clears redirect URL after successful login
- Returns early from useEffect after redirect

### Issue 5: "Invalid credentials" or "User already exists"
**Solutions**:
1. Try registering with a NEW email
2. If user exists, use login instead
3. Check MongoDB connection

## Testing Steps

### Test Registration
1. Go to `http://localhost:5173/register`
2. Fill in:
   - Name: Any name
   - Email: Use a UNIQUE email (e.g., user123@test.com)
   - Password: Any password (min 6 chars recommended)
   - Role: Patient
3. Click "Create Account"
4. Should redirect to dashboard or appointment page

### Test Login
1. Go to `http://localhost:5173/login`
2. Use credentials from registration
3. Click "Sign In"
4. Should redirect to dashboard or appointment page

### Test Protected Route
1. Clear localStorage: Open Console (F12) → `localStorage.clear()`
2. Navigate to `http://localhost:5173/appointment`
3. Should see alert and redirect to login
4. After login, should redirect back to appointment page

## Manual Tests You Can Run

### Test 1: Backend Registration Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"newuser@test.com","password":"test123","role":"patient"}'
```
Expected: Returns token and user object

### Test 2: Backend Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"test123"}'
```
Expected: Returns token and user object

### Test 3: Check MongoDB Connection
```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✓ MongoDB Connected')).catch(err => console.log('✗ MongoDB Error:', err))"
```

## Browser Console Checks

Open browser console (F12) and check for:

### Red Errors
- Look for any error messages
- Note the error type (Network, CORS, Syntax, etc.)

### Network Tab
1. Click "Network" tab
2. Try to login/register
3. Look for the request to `/api/auth/login` or `/api/auth/register`
4. Check:
   - Request URL: Should be http://localhost:5000/api/auth/...
   - Status Code: Should be 200 (success) or 400 (validation error)
   - Response: Should contain token and user data

### Console Tab
1. Look for warnings about dependencies
2. Look for navigation errors
3. Check if token is being stored: Type `localStorage.getItem('token')`

## Common Error Messages & Solutions

### "Missing fields"
- Make sure all required fields are filled
- Name, Email, and Password are required

### "User already exists"
- Email is already registered
- Try logging in instead
- Or use a different email

### "Invalid credentials"
- Wrong email or password
- Check for typos
- Password is case-sensitive

### "Server error"
- Backend might not be running
- MongoDB might not be connected
- Check backend terminal for errors

### Network Error / Failed to fetch
- Backend not running on port 5000
- CORS issue
- Wrong API URL in frontend .env file

## Quick Fix Checklist

- [ ] Backend server is running (`cd backend && npm run dev`)
- [ ] Frontend server is running (`cd frontend && npm run dev`)
- [ ] MongoDB is running (if using local MongoDB)
- [ ] `.env` files exist in both frontend and backend
- [ ] No errors in terminal (check both backend and frontend)
- [ ] Browser console shows no red errors
- [ ] Using a unique email for registration
- [ ] Password is at least 6 characters
- [ ] Clear browser cache and localStorage if needed

## Still Having Issues?

Please provide:
1. **Exact error message** from browser console
2. **Screenshot** of the error if possible
3. **Network tab** showing the failed request
4. **Backend terminal** output
5. **Steps to reproduce** the issue

This will help diagnose the specific problem you're experiencing.
