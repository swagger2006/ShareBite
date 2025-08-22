# 🍽️ ShareBite - Smart Food Waste Management Platform

[![Django](https://img.shields.io/badge/Django-4.2.7-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

ShareBite is a comprehensive food waste management platform that connects food providers with NGOs, volunteers, and individuals to reduce food waste and help those in need. The platform enables efficient food redistribution through a modern web application with role-based access control.

## 🌟 Features

### Core Functionality
- **Food Listing Management**: Food providers can list surplus food with details like quantity, location, and expiry time
- **Smart Request System**: NGOs and volunteers can request available food items
- **Real-time Status Tracking**: Track food from "Available" → "Requested" → "Collected" → "Distributed"
- **Role-based Access Control**: Different permissions for Food Providers, NGOs/Volunteers, Individuals, and Admins
- **Dashboard Analytics**: Comprehensive statistics and insights for food waste reduction
- **Notification System**: Email notifications for food listings and requests

### User Roles
- **Food Provider**: Restaurants, cafeterias, and food businesses that can list surplus food
- **NGO/Volunteer**: Organizations and volunteers who can request and collect food for distribution
- **Individual**: People who can request food for personal needs
- **Admin**: Platform administrators with full access control

### Technical Features
- **RESTful API**: Well-structured Django REST Framework backend
- **Modern UI**: React with TypeScript and Tailwind CSS
- **Authentication**: JWT-based secure authentication system
- **Database**: SQLite for development, PostgreSQL ready for production
- **Responsive Design**: Mobile-friendly interface
- **QR Code Integration**: For easy food collection verification

## 🏗️ Architecture

```
ShareBite/
├── backend/                 # Django REST API
│   ├── accounts/           # User management & authentication
│   ├── food_listings/      # Food listing management
│   ├── requests_app/       # Food request handling
│   └── food_donation/      # Main project settings
└── frontend/               # React TypeScript application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── types/          # TypeScript type definitions
    │   └── App.tsx         # Main application component
    └── superbase/          # Database migrations
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShareBite
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## 📱 Usage

### For Food Providers
1. Register as a Food Provider
2. Create food listings with details (title, description, quantity, location, expiry time)
3. Monitor requests for your food items
4. Update food status as it gets collected and distributed

### For NGOs/Volunteers
1. Register as NGO/Volunteer
2. Browse available food listings
3. Request food items for collection
4. Update status when food is collected and distributed

### For Individuals
1. Register as Individual
2. Browse and request available food items
3. Coordinate collection with food providers

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Food Listings
- `GET /api/food/` - List all food items
- `POST /api/food/` - Create new food listing (Food Providers only)
- `GET /api/food/{id}/` - Get specific food item
- `PUT /api/food/{id}/` - Update food listing
- `DELETE /api/food/{id}/` - Delete food listing
- `GET /api/food/available/` - Get available food for NGOs/Volunteers
- `GET /api/food/dashboard-stats/` - Get dashboard statistics

### Food Requests
- `GET /api/requests/` - List food requests
- `POST /api/requests/` - Create food request (NGOs/Volunteers only)
- `GET /api/requests/{id}/` - Get specific request
- `PUT /api/requests/{id}/` - Update request status
- `GET /api/requests/my-requests/` - Get user's requests
- `GET /api/requests/for-my-food/` - Get requests for user's food listings

## 🛠️ Technology Stack

### Backend
- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **Django CORS Headers**: Cross-origin resource sharing
- **SimpleJWT**: JWT authentication
- **Gunicorn**: WSGI HTTP Server
- **WhiteNoise**: Static file serving
- **PostgreSQL**: Production database (SQLite for development)

### Frontend
- **React 18.3.1**: UI library
- **TypeScript 5.5.3**: Type safety
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **React Hot Toast**: Notification system
- **Recharts**: Data visualization
- **QR Code**: QR code generation

## 🌍 Deployment

### Backend Deployment (Render/Heroku)
1. Set up environment variables
2. Configure PostgreSQL database
3. Run migrations
4. Collect static files
5. Deploy using `render.yaml` configuration

### Frontend Deployment (Vercel/Netlify)
1. Build the application: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Smart India Hackathon (SIH)
- Inspired by the need to reduce food waste and help communities
- Thanks to all contributors and supporters

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Made with ❤️ for a better tomorrow - reducing food waste, one meal at a time.**
