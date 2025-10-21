# 🎫 Modern Ticketing System UI

A modern, secure ticketing system built with React, TypeScript, Firebase, and Tailwind CSS.

## ✨ Features

- 🔐 **Authentication**: Firebase-based authentication with email verification
- 🎫 **Ticket Management**: Create, view, and manage support tickets
- 📚 **Knowledge Base**: Browse and search help articles
- 🎨 **Modern UI**: Built with Tailwind CSS and responsive design
- 🔒 **Auto-Logout**: Automatic session timeout for security
- 🌍 **Multi-Environment**: Separate configurations for local and production

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd modern-ticketing-system-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Firebase credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📚 Documentation

- **[Environment Setup Guide](./ENVIRONMENT_SETUP.md)** - Configure environment variables
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Vercel or other platforms
- **[Vercel Environment Variables Checklist](./VERCEL_ENV_CHECKLIST.md)** - ⚠️ **Must-read for Vercel deployments**
- **[Idle Timeout Feature](./IDLE_TIMEOUT.md)** - Auto-logout configuration

## 🔐 Security Features

### Automatic Session Timeout
- Users are automatically logged out after **15 minutes** of inactivity
- **1 minute warning** before auto-logout with option to continue
- Configurable timeout durations via environment variables
- See [IDLE_TIMEOUT.md](./IDLE_TIMEOUT.md) for details

### Authentication
- Firebase Authentication with email verification
- Protected routes requiring authentication
- Secure session management

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run dev:local    # Start with explicit local environment
```

### Production
```bash
npm run build        # Build for production
npm run build:prod   # Build with production environment
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── dashboard/      # Dashboard widgets
│   ├── knowledge/      # Knowledge base components
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── ticket/         # Ticket management components
│   └── ui/             # Reusable UI components
├── config/             # Configuration files
│   ├── env.ts          # Environment configuration
│   └── firebase.ts     # Firebase setup
├── context/            # React context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── NotificationContext.tsx
│   └── TicketContext.tsx
├── hooks/              # Custom React hooks
│   └── useIdleTimeout.ts # Idle detection hook
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
├── services/           # API and service layer
│   ├── authService.ts
│   ├── configService.ts
│   └── ticketService.ts
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## ⚙️ Configuration

### Environment Variables

Required variables for Firebase:
```env
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

Optional configuration:
```env
VITE_API_URL=http://localhost:3000
VITE_IDLE_TIMEOUT=15              # Minutes
VITE_IDLE_WARNING_TIME=1          # Minutes
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for complete guide.

## 🌐 Deployment

### Vercel (Recommended)

⚠️ **IMPORTANT**: Vercel requires manual environment variable configuration!

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
   - Go to Project Settings → Environment Variables
   - Add all `VITE_*` variables (see checklist below)
   - **Critical**: Set `VITE_API_URL` or it will default to localhost!
3. **Deploy** - Vercel will automatically build and deploy

📋 **Use the [Vercel Environment Variables Checklist](./VERCEL_ENV_CHECKLIST.md)** to ensure all variables are set.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Other Platforms

The app can be deployed to:
- Netlify
- GitHub Pages
- AWS Amplify
- Any static hosting service

## 🔧 Technology Stack

- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues or questions:
1. Check the documentation in the `/docs` folder
2. Review [IDLE_TIMEOUT.md](./IDLE_TIMEOUT.md) for security features
3. Open an issue on GitHub
4. Check the knowledge base in the app

## 🔄 Recent Updates

### Security Enhancements
- ✅ Added automatic idle timeout detection
- ✅ Warning modal before auto-logout
- ✅ Configurable timeout durations
- ✅ Activity tracking and session management

### Environment Management
- ✅ Separate local and production configurations
- ✅ Centralized environment variable management
- ✅ Type-safe configuration access
- ✅ Deployment guides for Vercel and other platforms

---

Made with ❤️ by the Modern Ticketing System Team
