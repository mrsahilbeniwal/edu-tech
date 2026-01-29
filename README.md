# 📚 EdTech Platform - Backend API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  A robust, scalable backend API for an educational technology platform built with <strong>NestJS</strong> and <strong>MongoDB</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?style=for-the-badge&logo=razorpay&logoColor=white" alt="Razorpay" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎓 **Course Management** | Create, update, and manage educational courses with categories |
| 👨‍🏫 **Instructor Profiles** | Comprehensive instructor management system |
| 💳 **Payment Integration** | Secure payment processing with Razorpay |
| 📊 **Analytics Dashboard** | Track platform metrics and user engagement |
| 📝 **CMS System** | Content management with sections, banners, and navigation |
| 💬 **Testimonials** | User testimonials and reviews management |
| 📧 **Contact Management** | Handle user inquiries and contact forms |
| 🤝 **Partner Management** | Manage platform partnerships |
| 📈 **Statistics** | Platform-wide statistics and reporting |
| 🎯 **Promotional Banners** | Dynamic promotional content management |

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) v11
- **Language:** TypeScript 5.7
- **Database:** MongoDB with Mongoose ODM
- **Payments:** Razorpay Integration
- **API Documentation:** Swagger/OpenAPI
- **Validation:** class-validator & class-transformer
- **Deployment:** Vercel Ready

---

## 📁 Project Structure

```
src/
├── controllers/        # Route handlers
│   ├── course.controller.ts
│   ├── instructor.controller.ts
│   ├── payment.controller.ts
│   ├── user.controller.ts
│   └── ...
├── services/           # Business logic
├── modules/            # Feature modules
├── schemas/            # MongoDB schemas
├── dto/                # Data Transfer Objects
└── main.ts             # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd edtech-main

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App
PORT=3000
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## 📚 API Documentation

Once the application is running, access the Swagger API documentation at:

```
http://localhost:3000/api
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📦 Deployment

The project is configured for deployment on **Vercel**. The `vercel.json` configuration is included.

```bash
# Deploy to Vercel
vercel --prod
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start in development mode with hot-reload |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the application |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Sahil Beniwal**

---

<p align="center">
  Made with ❤️ using NestJS
</p>
