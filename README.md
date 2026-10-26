# 🏥 Prescripto – Doctor Appointment Booking System

**A full-stack doctor appointment booking platform deployed on AWS Cloud.**

🌐 **Live Website:** https://d1i4ralnpk39il.cloudfront.net/

## 📌 Overview

Prescripto is a web-based doctor appointment booking system designed to simplify healthcare access by connecting patients with doctors through an intuitive and responsive platform. It enables users to explore doctors, manage appointments, and access healthcare services online.

The project demonstrates full-stack web development, REST API integration, database connectivity, and cloud deployment using Amazon Web Services (AWS).

## ✨ Features

- **Doctor Discovery:** Browse doctors and explore their specializations.
- **Appointment Booking:** Book appointments with available doctors.
- **User Authentication:** Secure registration and login.
- **Appointment Management:** Manage appointment bookings.
- **Doctor Dashboard:** Manage doctor profiles and appointments.
- **Admin Dashboard:** Manage doctors and oversee platform activities.
- **Responsive Interface:** Access the application across different screen sizes.
- **Cloud Deployment:** Host the frontend on AWS with CloudFront delivery.

## 🛠️ Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5 and CSS3
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database and Media Storage
- MongoDB Atlas
- Cloudinary

### Cloud Infrastructure
- **Amazon S3:** Frontend static hosting
- **Amazon CloudFront:** Content delivery and frontend distribution
- **Amazon EC2:** Backend application hosting

## ☁️ AWS Deployment Architecture

The application uses AWS services to deliver the frontend and handle backend requests.

1. The frontend is hosted in an Amazon S3 bucket.
2. Amazon CloudFront distributes the frontend to users.
3. API requests are routed to the backend hosted on Amazon EC2.
4. MongoDB Atlas manages application data.
5. Cloudinary handles image storage and delivery.

This architecture demonstrates the integration of cloud infrastructure with a full-stack web application.

## 🚀 Live Demo

Visit the deployed application:

👉 https://d1i4ralnpk39il.cloudfront.net/

## 📂 Project Structure

The project is organized into separate frontend and backend components.

```text
prescripto/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md
```

*Note: Adjust this structure to match the actual folders and files in your repository.*

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas account
- Cloudinary account
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Megu2024/cad-sem5-project.git
cd cad-sem5-project
```

**2. Install dependencies**

Navigate to the frontend and backend directories and install their dependencies:

```bash
npm install
```

Run this command separately in each directory containing a `package.json` file.

**3. Configure environment variables**

Create the appropriate `.env` files and configure the required database connection, authentication secrets, and Cloudinary credentials.

Never commit actual credentials or secret keys to GitHub.

**4. Start the application**

Use the development scripts defined in the respective `package.json` files to start the backend and frontend.

## 🔒 Security

- Store sensitive credentials in environment variables.
- Keep `.env` files out of version control.
- Restrict access to administrative functionality.
- Protect database credentials and authentication secrets.

## 🎯 Project Objectives

- Develop a functional full-stack healthcare application.
- Implement frontend and backend integration.
- Manage application data using a cloud-hosted database.
- Deploy a web application using AWS infrastructure.
- Understand cloud hosting, API routing, and content delivery.

## 👨‍💻 Author

**P. N. Megarajan**

GitHub: [Megu2024](https://github.com/Megu2024)

---

⭐ If you find this project interesting, consider starring the repository!

