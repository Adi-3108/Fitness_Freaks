# FitnessFreaks - Complete Fitness Management Platform

A comprehensive fitness management platform built with Next.js frontend and Spring Boot backend, offering workout plans, diet plans, equipment shopping, and gym management features.

## 🏋️ Features

### Core Features
- **User Authentication & Authorization** - Secure login/signup with OTP verification
- **Workout Plans** - Personalized workout plans for different fitness levels (Beginner, Intermediate, Advanced)
- **Diet Plans** - Customized diet plans for various goals (Weight Loss, Muscle Gain, Maintenance)
- **Equipment Store** - Online shopping for fitness equipment with Stripe payment integration
- **BMI Calculator** - Calculate and track your Body Mass Index
- **Class Booking** - Book free fitness classes
- **User Profiles** - Manage personal information and fitness goals
- **Reviews & Ratings** - Community-driven feedback system
- **Push Notifications** - Firebase-powered notifications for updates

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Live notifications and status updates
- **Payment Processing** - Secure Stripe integration for equipment purchases
- **Email Services** - Automated email notifications and plan delivery
- **Database Management** - MySQL database with JPA/Hibernate
- **Security** - Spring Security with JWT authentication
- **CORS Configuration** - Proper cross-origin resource sharing setup

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with TypeScript

- **Radix UI** - Accessible component library
- **Firebase** - Push notifications and messaging
- **Stripe** - Payment processing
- **React Hook Form** - Form management
- **Lucide React** - Icon library

### Backend
- **Spring Boot 3.5.0** - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **MySQL 8.0** - Database
- **Stripe Java SDK** - Payment processing
- **Spring Mail** - Email services
- **Maven** - Build tool

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **Java** (JDK 17 or higher)
- **MySQL** (8.0 or higher)
- **Maven** (3.6 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd FitnessFreaks-Copy
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Environment File
Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DATASOURCE_URL=jdbc:mysql://localhost:3306/fitnessfreaks?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DATASOURCE_USER=your_mysql_username
DATASOURCE_PASSWORD=your_mysql_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Stripe Configuration
STRIPE_API_KEY=your_stripe_secret_key
```

**Important Notes:**
- Replace `your_mysql_username` and `your_mysql_password` with your MySQL credentials
- For Gmail, use an App Password instead of your regular password
- Get your Stripe API key from the Stripe Dashboard

#### Run the Backend
```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven directly
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Create Environment File
Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Firebase Configuration (for push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Important Notes:**
- Get Firebase configuration from your Firebase Console
- Get Stripe publishable key from your Stripe Dashboard

#### Install Dependencies
```bash
npm install
```

#### Run the Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🗄️ Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE fitnessfreaks;
   ```

2. **Database Tables:** The application will automatically create all necessary tables using JPA/Hibernate when you first run the backend.

## 📱 Usage

1. **Access the Application:** Open `http://localhost:3000` in your browser
2. **Register/Login:** Create an account or login with existing credentials
3. **Explore Features:**
   - Calculate your BMI
   - Get personalized workout plans
   - Access diet plans
   - Shop for fitness equipment
   - Book fitness classes
   - Manage your profile

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `.env` file

### Stripe Setup
1. Create a Stripe account
2. Get your API keys from the Dashboard
3. Add them to your environment files

### Firebase Setup
1. Create a Firebase project
2. Enable Cloud Messaging
3. Get your configuration from Project Settings

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   - Backend: Change port in `application.properties`
   - Frontend: Use `npm run dev -- -p 3001`

2. **Database Connection Issues:**
   - Verify MySQL is running
   - Check credentials in `.env` file
   - Ensure database exists

3. **CORS Errors:**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check CORS configuration in `CorsConfig.java`

4. **Email Not Sending:**
   - Verify Gmail App Password
   - Check email configuration in `.env`

## 📁 Project Structure

```
FitnessFreaks-Copy/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/fitnessfreaks/backend/
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST controllers
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data repositories
│   │       ├── service/     # Business logic
│   │       └── util/        # Utility classes
│   └── src/main/resources/
│       └── application.properties
├── frontend/                # Next.js Frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   └── public/              # Static assets
└── *.sql                    # Database queries
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Happy Fitness Journey! 💪**
