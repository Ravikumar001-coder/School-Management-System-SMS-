# School Management System (SMS)

A robust, modern ERP system for K-12 schools built with Spring Boot and React.

## 🚀 Features

- **Academic Management**: Classes, Subjects, and Attendance.
- **Student Lifecycle**: Enrollment, Profiles, and Performance tracking.
- **Exam Engine**: Scheduled tests and automated grading.
- **Finance**: Fee collection and receipt generation.
- **Role-Based Access Control**: Tailored experiences for Admins, Teachers, and Students.

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.5.x, Spring Security, JWT, MySQL.
- **Frontend**: React 19, Tailwind CSS, React Router 7.

## 🔒 Security

This project is configured with security best practices:
- **Stateless Authentication**: JWT-based auth flow.
- **Environment Variables**: No hardcoded secrets (using `.env` and Spring placeholders).
- **Secure File Storage**: Authentication required for file access.
- **GitHub Scanning**: Automated CodeQL security analysis.

## 📦 Getting Started

### Prerequisites
- JDK 17+
- Node.js 18+
- MySQL 8+

### Setup

1. **Clone the repository**
2. **Configure environment variables**:
   - The `.env` file has been created in the root directory.
   - Update `DB_PASSWORD`, `JWT_SECRET`, etc. in `.env` as needed.
3. **Backend Setup**:
   ```bash
   cd sms
   ./mvnw spring-boot:run
   ```
4. **Frontend Setup**:
   ```bash
   cd school-frontend
   npm install
   npm run dev
   ```


## 🛡️ Security Policy

Please refer to [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License.
