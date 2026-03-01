# 🎓 Learning Management System (LMS) Backend

A scalable and production-ready LMS backend built using **Node.js, Express, MongoDB, Stripe, Razorpay, Cloudinary, and JWT Authentication**.

This system allows instructors to create courses, upload lectures, and students to purchase courses and track learning progress.

---

## 🚀 Features

### 👨‍🏫 Instructor Features
- Create & manage courses
- Upload course thumbnails & videos
- Add lectures to courses
- View enrolled students

👉 Courses are created with thumbnail upload & instructor linking :contentReference[oaicite:0]{index=0}  

---

### 👨‍🎓 Student Features
- Browse & search courses
- Purchase courses
- Track lecture progress
- Mark course as completed

👉 Completion percentage is calculated from lecture progress :contentReference[oaicite:1]{index=1}  

---

### 💳 Payment Integration
- Stripe Checkout
- Razorpay Payment Verification
- Purchase records stored in database

👉 Stripe checkout session implementation :contentReference[oaicite:2]{index=2}  

---

### 🔐 Authentication & Security
- JWT Authentication
- Role-based access (Student / Instructor)
- Password hashing with bcrypt
- Secure cookies

👉 JWT token generation handled here :contentReference[oaicite:3]{index=3}  

---

### ☁️ Media Upload
- Cloudinary video & image storage
- File uploads using Multer

👉 Cloudinary upload utility :contentReference[oaicite:4]{index=4}  

---

### 📊 Health Monitoring
- API to check server & database health

👉 Health check endpoint :contentReference[oaicite:5]{index=5}  

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Stripe & Razorpay
- Cloudinary
- Multer
- bcrypt

---

📈 Future Improvements

Frontend with React / Next.js

Course ratings & reviews

Live classes

Email notifications

Docker deployment

AI-based course recommendations
