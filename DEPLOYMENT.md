# InkStream Deployment Guide

## 🚀 Quick Start

Your InkStream app is ready to run! The development server is currently running at:
**http://localhost:5174/**

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

## 🛠️ Development Setup

1. **Navigate to the project directory:**
```bash
cd manga-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Production Build

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🌐 Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Netlify
```bash
# Build the project
npm run build

# Upload the 'dist' folder to Netlify
```

### 3. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://yourusername.github.io/manga-app",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### 4. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## ⚙️ Environment Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### Production Environment
```env
VITE_MANGADX_API_URL=https://api.mangadx.org
VITE_APP_NAME=InkStream
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
```

## 🔧 Build Optimization

### Bundle Analysis
```bash
npm run build -- --analyze
```

### Performance Tips
- Enable gzip compression on your server
- Use a CDN for static assets
- Implement service worker for caching
- Optimize images with WebP format

## 🚨 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
```

**Build errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API CORS issues:**
- Ensure MangaDx API allows your domain
- Check browser console for specific errors

### Performance Issues
- Check network tab for slow API calls
- Monitor bundle size with build analyzer
- Implement lazy loading for images

## 📊 Monitoring

### Production Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user engagement metrics
- Set up uptime monitoring

### Analytics
- Google Analytics integration
- User behavior tracking
- Performance metrics
- API usage statistics

## 🔒 Security Considerations

### API Security
- Never expose API keys in client code
- Implement rate limiting
- Use HTTPS in production
- Validate all user inputs

### Content Security
- Implement Content Security Policy (CSP)
- Sanitize user-generated content
- Use secure headers
- Regular security audits

## 📱 Mobile Optimization

### PWA Features
- Add service worker
- Create app manifest
- Implement offline functionality
- Add to home screen capability

### Performance
- Optimize for mobile networks
- Implement lazy loading
- Use responsive images
- Minimize JavaScript bundle

## 🎯 Next Steps

1. **Test the application** thoroughly
2. **Customize the design** to match your preferences
3. **Add user authentication** if needed
4. **Implement favorites** and reading history
5. **Deploy to production** using your preferred platform

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify API connectivity
3. Review the documentation
4. Check GitHub issues for similar problems

---

**Happy Reading! 📚✨**