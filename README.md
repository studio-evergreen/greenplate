# 🥗 GreenPlate

> A production-ready Next.js 15 boilerplate with TypeScript, Supabase, Sentry, and comprehensive tooling

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)
[![Sentry](https://img.shields.io/badge/Sentry-Integrated-purple)](https://sentry.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## ✨ Features

### 🚀 **Modern Stack**
- **Next.js 15** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS** 4.1 with dark mode
- **React 19** with latest features

### 🔐 **Authentication & Database**
- **Supabase** integration with TypeScript types
- Authentication flows (email/password, OAuth)
- Row Level Security (RLS) ready
- Real-time subscriptions support

### 📊 **Monitoring & Analytics**
- **Sentry** error tracking and performance monitoring
- Comprehensive error boundaries
- User-friendly error handling
- Development and production configurations

### 🎨 **UI & UX**
- **Dark/Light mode** with system preference detection
- **Internationalization** (i18n) with English/Korean
- Responsive design with mobile-first approach
- Accessible components with ARIA support
- Toast notifications system

### 🧪 **Testing & Quality**
- **Jest** + **Testing Library** setup
- 60+ tests with 67% coverage
- **ESLint** + **TypeScript** strict rules
- Pre-configured test environment

### ⚡ **Performance**
- Code splitting with dynamic imports
- Optimized bundle size (101kB shared)
- React memo and performance hooks
- Image optimization ready

### 🛠️ **Developer Experience**
- **Type-safe** environment variables with Zod validation
- Comprehensive error handling
- Hot reload with Turbopack
- Git hooks ready
- Detailed documentation

## 🚀 Quick Start

### 1. **Clone & Install**

```bash
# Use this template
npx create-next-app@latest my-app --example https://github.com/your-username/greenplate

# Or clone directly
git clone https://github.com/your-username/greenplate.git my-app
cd my-app
npm install
```

### 2. **Environment Setup**

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
code .env.local
```

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. **Run Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## 📖 Documentation

- 📋 **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration
- 🏗️ **[Architecture](./docs/ARCHITECTURE.md)** - Project structure and patterns
- 🧪 **[Testing Guide](./docs/TESTING.md)** - Testing strategies and examples
- 🚀 **[Deployment](./docs/DEPLOYMENT.md)** - Production deployment guides

## 📁 Project Structure

```
greenplate/
├── 📱 app/                  # Next.js App Router
│   ├── 🏠 (main)/          # Main app routes
│   ├── 🧩 components/      # React components
│   ├── 🔌 api/             # API routes
│   └── 🎨 globals.css      # Global styles
├── 📚 lib/                 # Utilities & config
│   ├── ⚙️ config/          # App configuration
│   ├── 📋 constants/       # App constants
│   └── 🛠️ utils/           # Helper functions
├── 🌍 locales/             # i18n translations
├── 🧪 __tests__/           # Test files
├── 📖 docs/                # Documentation
└── 🔧 Various config files
```

## 🧪 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Deployment
npm run build        # Production build
```

## 🎯 What's Included

### 🧩 **Pre-built Components**

- **Button** - Multiple variants with loading states
- **Input** - Form input with validation and accessibility
- **Toast** - Notification system with multiple types
- **Theme Toggle** - Dark/light mode switcher
- **Language Dropdown** - i18n language selector
- **Error Boundary** - React error catching and recovery

### 🔧 **Utilities**

- **Environment validation** with Zod schemas
- **Type-safe cookies** management
- **Form validation** helpers
- **Auth error handling** with i18n support
- **Route constants** for type-safe navigation

### 🎨 **Styling**

- **CSS Variables** for consistent theming
- **Tailwind classes** with design system
- **Dark mode** automatic switching
- **Responsive breakpoints** mobile-first

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### 🐛 **Bug Reports**
Found a bug? [Open an issue](https://github.com/your-username/greenplate/issues/new?template=bug_report.md)

### 💡 **Feature Requests**
Have an idea? [Request a feature](https://github.com/your-username/greenplate/issues/new?template=feature_request.md)

## 📊 Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 15 | React framework with App Router |
| **Language** | TypeScript | Type safety and developer experience |
| **Styling** | Tailwind CSS 4.1 | Utility-first CSS framework |
| **Database** | Supabase | Backend as a Service with PostgreSQL |
| **Auth** | Supabase Auth | Authentication and user management |
| **Monitoring** | Sentry | Error tracking and performance monitoring |
| **Testing** | Jest + Testing Library | Unit and component testing |
| **Linting** | ESLint + TypeScript ESLint | Code quality and consistency |
| **Deployment** | Vercel (recommended) | Edge functions and global CDN |

## 🎯 Use Cases

Perfect for:
- 🏢 **SaaS applications**
- 📱 **Web applications**
- 🛒 **E-commerce sites**
- 📊 **Dashboards**
- 📝 **Content management**
- 🎓 **Learning projects**

## 🔄 Updates

This boilerplate is actively maintained and updated with:
- Latest Next.js features
- Security patches
- New tooling and best practices
- Community feedback improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment platform
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- All the open source contributors

## 💬 Support

- 📖 **Documentation**: Check the `/docs` folder
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/greenplate/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/greenplate/discussions)
- 📧 **Email**: support@yourproject.com

---

<div align="center">

**[⭐ Star this repo](https://github.com/your-username/greenplate)** • **[🍴 Fork it](https://github.com/your-username/greenplate/fork)** • **[📖 Read the docs](./docs/SETUP.md)**

*Made with ❤️ for the Next.js community*

</div>