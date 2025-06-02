# NAItive Hello World Worker - Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.17.0 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account with Workers enabled

### Install Dependencies
```bash
npm install
```

### Deploy to Cloudflare Workers
```bash
# Deploy to your workers.dev subdomain first
wrangler deploy

# The app will be available at:
# https://naitive-hello-world.YOUR_SUBDOMAIN.workers.dev
```

## 🌐 Custom Domain Setup (test.naitive.io)

### 1. Add Custom Domain in Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** > **naitive-hello-world**
3. Go to **Settings** > **Triggers**
4. Click **Add Custom Domain**
5. Enter: `test.naitive.io`
6. Click **Add Domain**

### 2. DNS Configuration
Make sure `test.naitive.io` has proper DNS settings:
- **Type**: CNAME or A record
- **Name**: test
- **Target**: Your Worker route or Cloudflare proxy

### 3. Verify Deployment
```bash
curl https://test.naitive.io/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-20T...",
  "message": "Hello World from Cloudflare Worker!"
}
```

## 📋 Features Included

### Routes
- **`/`** - Beautiful hello world homepage with features showcase
- **`/auth`** - Google authentication placeholder page  
- **`/api/health`** - JSON health check endpoint

### Ready for Google Workspace Integration
- Authentication page with Google branding
- OAuth flow placeholder
- Session management preparation (KV namespace ready)

### Modern UI/UX
- Responsive design
- Gradient backgrounds
- Interactive elements
- Status indicators
- Professional styling

## 🔧 Development

### Local Development
```bash
npm run dev
# Opens at http://localhost:8787
```

### Production Deployment
```bash
npm run deploy
```

## 📊 Monitoring

### Health Check
```bash
curl https://test.naitive.io/api/health
```

### Browser Testing
1. Visit: https://test.naitive.io
2. Click "Test Authentication" button
3. Verify placeholder auth flow

## 🔐 Next Steps for Google Auth

1. **OAuth Setup**:
   - Create Google Cloud Project
   - Enable Google Workspace APIs
   - Configure OAuth2 credentials

2. **Environment Variables**:
   ```bash
   wrangler secret put GOOGLE_CLIENT_ID
   wrangler secret put GOOGLE_CLIENT_SECRET
   ```

3. **Session Storage**:
   - Enable KV namespace in `wrangler.toml`
   - Implement session management

4. **Callback Handling**:
   - Add `/auth/callback` route
   - Handle OAuth code exchange

## 🐛 Troubleshooting

### Domain Issues
- Verify DNS propagation: `dig test.naitive.io`
- Check Cloudflare proxy status
- Confirm Worker route configuration

### Deployment Issues
- Check Wrangler authentication: `wrangler whoami`
- Verify account limits: Workers quota
- Review deployment logs in dashboard

## 📈 Performance

- **Global Edge Deployment**: Available in 200+ locations
- **Cold Start**: < 10ms typical
- **Response Time**: < 50ms global average
- **Uptime**: 99.99% SLA

---

**Issue Reference**: Linear NAI-17 - Create hello world app at test.naitive.io for Google Workspace authentication testing 