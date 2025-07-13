# 🚀 Deployment Guide

This guide covers deploying your GreenPlate application to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] All environment variables configured
- [ ] Production build working locally (`npm run build`)
- [ ] Tests passing (`npm test`)
- [ ] Linting clean (`npm run lint`)

## 🌟 Vercel (Recommended)

Vercel offers the best Next.js experience with zero configuration.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/greenplate)

### Manual Setup

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

### Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🐳 Docker Deployment

Build and deploy with Docker for any container platform.

### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t greenplate .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  greenplate
```

## ☁️ Other Platforms

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git" → Select your repo

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Site settings → Environment variables
   - Add all required variables

### Railway

1. **Deploy from GitHub**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Environment Variables**
   - Railway dashboard → Variables
   - Add all required variables

### DigitalOcean App Platform

1. **Create App**
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Apps → Create App → GitHub

2. **Configuration**
   ```yaml
   name: greenplate
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/greenplate
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
   ```

## 🔧 Build Optimization

### Analyze Bundle Size

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze build
npm run analyze
```

### Performance Tips

1. **Image Optimization**
   ```tsx
   import Image from 'next/image'
   
   <Image
     src="/logo.png"
     alt="Logo"
     width={200}
     height={100}
     priority // for above-the-fold images
   />
   ```

2. **Dynamic Imports**
   ```tsx
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     ssr: false,
     loading: () => <div>Loading...</div>
   })
   ```

3. **API Route Optimization**
   ```tsx
   export const config = {
     runtime: 'edge', // Use Edge Runtime
   }
   ```

## 🔍 Monitoring

### Vercel Analytics

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Performance Monitoring

Sentry performance monitoring is already configured. In production:

1. **Set Proper Sample Rates**
   ```typescript
   // sentry.server.config.ts
   Sentry.init({
     tracesSampleRate: 0.1, // 10% for production
   })
   ```

2. **Custom Performance Marks**
   ```typescript
   import * as Sentry from '@sentry/nextjs'
   
   const transaction = Sentry.startTransaction({
     name: 'Custom Operation',
     op: 'task'
   })
   
   // Your code here
   
   transaction.finish()
   ```

## 🔐 Security

### Environment Variables

- Never commit `.env.local` to git
- Use different values for staging/production
- Rotate secrets regularly

### Security Headers

Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📊 Monitoring & Alerts

### Uptime Monitoring

1. **Vercel (Built-in)**
   - Automatic uptime monitoring
   - Performance insights
   - Error tracking

2. **External Services**
   - [UptimeRobot](https://uptimerobot.com/)
   - [Pingdom](https://www.pingdom.com/)
   - [StatusCake](https://www.statuscake.com/)

### Error Alerts

Sentry automatically sends alerts for:
- New errors
- Error spikes
- Performance issues

Configure notification rules in Sentry dashboard.

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Environment Variable Issues**
- Check variable names match exactly
- Ensure NEXT_PUBLIC_ prefix for client-side variables
- Verify values are properly quoted

**Performance Issues**
- Check bundle analyzer output
- Review Core Web Vitals in Vercel dashboard
- Monitor Sentry performance traces

### Getting Help

- [Vercel Support](https://vercel.com/help)
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/your-username/greenplate/issues)

## 🎯 Production Checklist

Before going live:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations complete
- [ ] SSL certificate configured
- [ ] Domain pointed to hosting
- [ ] Error monitoring active
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place
- [ ] Analytics tracking setup
- [ ] SEO meta tags configured

---

**Happy deploying! 🚀**