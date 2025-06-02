# NAItive Cloudflare Worker Deployment Guide

## 🚀 Complete Deployment Workflow Using MCP Tools

This guide documents the complete process for deploying secure, production-ready Cloudflare Workers using MCP (Model Context Protocol) tools and modern DevOps practices.

## 📋 Prerequisites

### Required Tools
- **Node.js** (v16.17.0 or later)
- **Wrangler CLI** (v4.x recommended)
- **Cloudflare Account** with Workers enabled
- **MCP Tools Access** (via Cursor or compatible editor)

### MCP Servers Used
- **Cloudflare Bindings MCP**: Worker/resource management
- **Cloudflare Documentation MCP**: API reference and best practices
- **Linear MCP**: Project tracking and issue management
- **GitHub MCP**: Repository and file management

## 🏗️ Development Workflow

### Phase 1: Project Setup & Discovery

#### 1.1 MCP Tools Verification
```bash
# Verify MCP tools are available and working
# Test with basic commands:
mcp_cloudflareBindings_accounts_list
mcp_cloudflareBindings_workers_list
```

#### 1.2 Account Configuration
```bash
# Set active Cloudflare account
mcp_cloudflareBindings_set_active_account(accountId)
```

#### 1.3 Project Structure Creation
Use MCP `edit_file` tool to create:
- `src/index.js` - Main Worker application
- `package.json` - Dependencies and scripts
- `wrangler.toml` - Deployment configuration
- `DEPLOYMENT.md` - Deployment instructions

### Phase 2: Application Development

#### 2.1 Worker Application Architecture
```javascript
// src/index.js structure
export default {
  async fetch(request, env, ctx) {
    // Security validation
    // Routing logic
    // API endpoints
    // Error handling
  }
};
```

#### 2.2 Security Implementation
- **Hostname Validation**: Block unauthorized domains
- **Security Headers**: CSRF, XSS, and content protection
- **Environment-Based Access**: Production vs development controls
- **Authentication Ready**: Prepared for SSO integration

#### 2.3 API Design Patterns
- **Health Check**: `/api/health` for monitoring
- **Feature APIs**: `/api/chat`, `/api/analytics` for functionality
- **Error Handling**: Consistent error responses
- **CORS Configuration**: For cross-origin requests

### Phase 3: Local Development & Testing

#### 3.1 Dependency Installation
```bash
cd your-project-directory
npm install
```

#### 3.2 Local Development Server
```bash
# Start local development server
npm run dev
# or
npx wrangler dev
```

#### 3.3 Authentication Setup
```bash
# Authenticate with Cloudflare
npx wrangler login
```

**Important**: Use Wrangler v4.x for reliable OAuth authentication. Update if needed:
```bash
npm install --save-dev wrangler@4
```

### Phase 4: Deployment Strategy

#### 4.1 Development Deployment
```bash
# Deploy development version for testing
npx wrangler deploy --name app-name-development --var ENVIRONMENT:development
```

#### 4.2 Production Deployment
```bash
# Deploy production version
npx wrangler deploy
```

#### 4.3 Configuration Management
```toml
# wrangler.toml
name = "your-app-name"
main = "src/index.js"
compatibility_date = "2023-12-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
APP_NAME = "Your App Name"
```

### Phase 5: Custom Domain & Security

#### 5.1 Custom Domain Setup
1. **Cloudflare Dashboard**: Workers & Pages > Your Worker > Settings > Domains
2. **Add Custom Domain**: `your-domain.com`
3. **DNS Auto-Configuration**: Cloudflare handles SSL and DNS
4. **Verification**: Test domain accessibility

#### 5.2 Access Control Configuration
- **Cloudflare Access**: Zero Trust authentication
- **Google Workspace Integration**: SSO setup
- **Access Policies**: User/group-based permissions
- **Security Rules**: Additional protection layers

### Phase 6: Monitoring & Maintenance

#### 6.1 Health Monitoring
```bash
# Health check testing
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "message": "Application running",
  "environment": "production"
}
```

#### 6.2 Performance Optimization
- **Bundle Size**: Keep under 25KB for optimal performance
- **Gzip Compression**: Automatic via Cloudflare
- **Global Distribution**: Edge deployment benefits
- **Caching Strategy**: Leverage Cloudflare Cache API

#### 6.3 Security Auditing
- **Regular Updates**: Keep dependencies current
- **Security Headers**: Verify implementation
- **Access Logs**: Monitor authentication attempts
- **Penetration Testing**: Periodic security validation

## 🔧 Advanced Patterns

### Multi-Environment Management
```bash
# Development
npx wrangler deploy --env development

# Staging  
npx wrangler deploy --env staging

# Production
npx wrangler deploy --env production
```

### Secret Management
```bash
# Set environment secrets
npx wrangler secret put SECRET_NAME
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

### KV Storage Integration
```toml
# wrangler.toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

### D1 Database Integration
```toml
# wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "your-database"
database_id = "your-database-id"
```

## 🚨 Common Issues & Solutions

### Issue: OAuth Login Fails
**Solution**: Update to Wrangler v4.x
```bash
npm install --save-dev wrangler@4
npx wrangler login
```

### Issue: Custom Domain 302 Redirects
**Solution**: Check DNS propagation and SSL certificate status
```bash
dig your-domain.com
curl -I https://your-domain.com
```

### Issue: Workers.dev Access Despite Security
**Solution**: Verify environment variables and hostname validation
```javascript
const isDevelopment = env.ENVIRONMENT !== 'production';
```

### Issue: Performance Degradation
**Solution**: Monitor bundle size and optimize assets
```bash
npx wrangler deploy --dry-run --outdir dist
```

## 📊 Best Practices

### Security
- ✅ Always implement hostname validation
- ✅ Use environment-based access controls
- ✅ Implement comprehensive security headers
- ✅ Never expose sensitive data in client code
- ✅ Use Cloudflare Access for authentication

### Performance
- ✅ Keep bundle size under 25KB when possible
- ✅ Use efficient routing patterns
- ✅ Implement proper caching strategies
- ✅ Minimize API response times
- ✅ Optimize images and assets

### Development
- ✅ Use MCP tools for efficient file management
- ✅ Implement comprehensive error handling
- ✅ Create meaningful health check endpoints
- ✅ Document API endpoints thoroughly
- ✅ Use consistent naming conventions

### Deployment
- ✅ Test in development environment first
- ✅ Use environment variables for configuration
- ✅ Implement gradual rollout strategies
- ✅ Monitor deployment success metrics
- ✅ Maintain rollback capabilities

## 🎯 Project Management Integration

### Linear Issue Tracking
- Use Linear MCP for real-time progress updates
- Document deployment steps in issue comments
- Track authentication testing results
- Maintain deployment checklists

### Documentation Standards
- Keep README files current
- Document API endpoints
- Maintain troubleshooting guides
- Update security procedures

## 🌟 Success Metrics

### Performance Targets
- **Cold Start**: < 10ms
- **Response Time**: < 100ms
- **Uptime**: 99.99%
- **Bundle Size**: < 25KB

### Security Compliance
- ✅ Zero Trust authentication
- ✅ SOC 2 compliance ready
- ✅ GDPR compliance features
- ✅ Enterprise security standards

### User Experience
- ✅ Mobile-responsive design
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ Progressive enhancement
- ✅ Graceful error handling

---

## 📞 Support & Resources

- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/
- **Wrangler CLI Reference**: https://developers.cloudflare.com/workers/wrangler/
- **Zero Trust Setup**: https://developers.cloudflare.com/zero-trust/
- **MCP Documentation**: https://modelcontextprotocol.io/

---

**Created**: June 2025  
**Last Updated**: June 2025  
**Version**: 1.0  
**Author**: NAItive Development Team 