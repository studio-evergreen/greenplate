# 🛠️ Setup Guide

This guide will help you set up the GreenPlate boilerplate for your project.

## 📋 Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**
- **Git**

## 🚀 Quick Start

### 1. Clone or Download

```bash
# Option A: Clone this repository
git clone https://github.com/your-username/greenplate.git your-project-name
cd your-project-name

# Option B: Use as template (recommended)
# Click "Use this template" on GitHub
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your actual values
code .env.local  # or use your preferred editor
```

### 4. Configure Services

#### Supabase Setup (Required)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in your project details

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy the `URL` and `anon/public` key
   - Add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. **Set Up Authentication**
   - Go to Authentication → Settings
   - Configure your authentication providers
   - For Google OAuth: Add your redirect URLs

#### Sentry Setup (Optional but Recommended)

1. **Create a Sentry Project**
   - Go to [sentry.io](https://sentry.io)
   - Create a new project (Next.js)
   - Get your DSN

2. **Configure Sentry**
   - Add your DSN to `.env.local`:

```env
SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/your-project-id
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
greenplate/
├── app/                    # Next.js 13+ App Router
│   ├── (main)/            # Main application routes
│   ├── components/        # Reusable React components
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   ├── config/           # Configuration files
│   ├── constants/        # Application constants
│   └── utils/            # Utility functions
├── locales/              # Internationalization files
├── public/               # Static assets
├── __tests__/            # Test files
└── docs/                 # Documentation
```

## 🔧 Configuration

### TypeScript

The project uses strict TypeScript configuration. Key features:
- Strict type checking
- Path aliases (`@/*` → `./`)
- Next.js optimizations

### ESLint & Prettier

Code quality tools are pre-configured:
- ESLint with Next.js rules
- Automatic formatting on save
- Pre-commit hooks (if configured)

### Tailwind CSS

Utility-first CSS framework with:
- Dark mode support
- Custom color variables
- Component-friendly classes

### Testing

Jest and Testing Library setup:
- Component testing
- Utility function testing
- Coverage reporting
- Mocking configurations

## 🌐 Internationalization

The boilerplate includes i18n support:

1. **Add New Languages**
   - Create new JSON files in `locales/`
   - Add language codes to `validation.ts`

2. **Use Translations**
   ```tsx
   const { t } = useLanguage();
   return <h1>{t('welcome.title')}</h1>;
   ```

## 🎨 Theming

Dark/Light mode is built-in:

1. **CSS Variables**
   - Defined in `globals.css`
   - Automatically switch based on theme

2. **Theme Toggle**
   ```tsx
   const { theme, setTheme } = useTheme();
   ```

## 🚦 Error Handling

Comprehensive error handling:
- ErrorBoundary for React errors
- Toast notifications for user feedback
- Sentry integration for production monitoring

## 📱 Components

Pre-built components include:
- `Button` - Customizable button with variants
- `Input` - Form input with validation
- `Toast` - Notification system
- `ThemeToggle` - Dark/light mode switcher

## 🔐 Security

Security best practices included:
- Environment variable validation
- Type-safe API calls
- Secure authentication flow
- XSS protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app is compatible with:
- Netlify
- Railway
- DigitalOcean App Platform
- Any Node.js hosting

## 🆘 Troubleshooting

### Common Issues

**Build Errors**
- Check environment variables
- Verify all dependencies are installed
- Run `npm run lint` to check for errors

**Authentication Issues**
- Verify Supabase URLs and keys
- Check redirect URLs configuration
- Ensure cookies are enabled

**Sentry Not Working**
- Verify DSN configuration
- Check if Sentry is enabled in development
- Review browser console for errors

### Getting Help

- Check the [Issues](https://github.com/your-username/greenplate/issues) page
- Read the [FAQ](./FAQ.md)
- Review the [Contributing Guide](./CONTRIBUTING.md)

## 🎯 Next Steps

After setup:

1. **Customize Branding**
   - Update `app/config.ts`
   - Replace logos and icons
   - Modify color scheme

2. **Add Your Features**
   - Create new pages in `app/`
   - Add API routes in `app/api/`
   - Build custom components

3. **Configure Database**
   - Set up Supabase tables
   - Add Row Level Security policies
   - Create database functions

4. **Deploy to Production**
   - Set up CI/CD pipeline
   - Configure production environment variables
   - Enable monitoring and analytics

Happy coding! 🚀