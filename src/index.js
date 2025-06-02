export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Security: Only allow access from authorized domains
    const allowedHostnames = ['test.naitive.io'];
    const hostname = url.hostname;
    
    // In development/testing, allow workers.dev domain
    const isWorkersDev = hostname.endsWith('.workers.dev');
    const isDevelopment = env.ENVIRONMENT !== 'production';
    
    if (!allowedHostnames.includes(hostname) && !(isDevelopment && isWorkersDev)) {
      return new Response('Access Denied: This application is only accessible through authorized domains.', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      });
    }
    
    // Add security headers
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Robots-Tag': 'noindex, nofollow'
    };
    
    // Advanced routing
    if (url.pathname === '/') {
      return new Response(getAIWorkspaceHub(), {
        headers: { 
          'Content-Type': 'text/html',
          ...securityHeaders
        }
      });
    }
    
    if (url.pathname === '/api/chat') {
      return handleAIChat(request, env);
    }
    
    if (url.pathname === '/api/analytics') {
      return handleAnalytics(request, env);
    }
    
    if (url.pathname === '/api/health') {
      return Response.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'NAItive AI Workspace Hub - Powered by Cloudflare Workers',
        hostname: hostname,
        environment: env.ENVIRONMENT || 'development',
        features: ['AI Chat', 'Analytics', 'Google Workspace Integration', 'Real-time Dashboard']
      }, {
        headers: securityHeaders
      });
    }
    
    // Default 404
    return new Response('Not Found', { 
      status: 404,
      headers: securityHeaders
    });
  },
};

async function handleAIChat(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { message } = await request.json();
    
    // Simulate AI responses (in production, this would connect to AI service)
    const responses = [
      "I'm here to help you boost productivity! What would you like to accomplish today?",
      "Based on your Google Workspace data, I notice you have 3 upcoming meetings. Would you like me to prepare summaries?",
      "I can help you automate workflows, analyze documents, or generate content. What's your priority?",
      "Great question! Let me analyze your workspace data and provide insights...",
      "I've integrated with your Google Calendar and can suggest optimal meeting times. Shall I proceed?",
      "Your productivity score has increased 23% this week! Here's what's driving the improvement...",
      "I can help streamline your email management. I noticed you have 47 unread emails - shall I categorize them?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add realistic delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return Response.json({
      response: randomResponse,
      timestamp: new Date().toISOString(),
      confidence: 0.85 + Math.random() * 0.14,
      suggestions: [
        "Schedule a meeting",
        "Analyze documents", 
        "Generate report",
        "Check calendar"
      ]
    });
  } catch (error) {
    return Response.json({ error: 'Failed to process message' }, { status: 400 });
  }
}

async function handleAnalytics(request, env) {
  // Generate realistic analytics data
  const analytics = {
    productivity: {
      score: Math.floor(75 + Math.random() * 20),
      trend: Math.random() > 0.5 ? 'up' : 'down',
      change: Math.floor(Math.random() * 15) + 1
    },
    meetings: {
      today: Math.floor(Math.random() * 5) + 1,
      thisWeek: Math.floor(Math.random() * 20) + 10,
      avgDuration: Math.floor(30 + Math.random() * 45)
    },
    emails: {
      unread: Math.floor(Math.random() * 50) + 10,
      processed: Math.floor(Math.random() * 100) + 50,
      responseTime: Math.floor(Math.random() * 120) + 15
    },
    documents: {
      created: Math.floor(Math.random() * 10) + 2,
      collaborated: Math.floor(Math.random() * 15) + 5,
      shared: Math.floor(Math.random() * 8) + 1
    },
    aiInsights: [
      "Peak productivity hours: 9-11 AM",
      "Most collaborative day: Tuesday",
      "Suggestion: Block 2-4 PM for deep work",
      "Email efficiency improved 15% this week"
    ]
  };
  
  return Response.json(analytics);
}

function getAIWorkspaceHub() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAItive AI Workspace Hub</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
            color: #333;
            overflow-x: hidden;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .logo {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            text-shadow: 0 0 30px rgba(255,255,255,0.3);
            animation: glow 3s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { text-shadow: 0 0 30px rgba(255,255,255,0.3); }
            to { text-shadow: 0 0 50px rgba(255,255,255,0.8); }
        }
        
        .tagline {
            font-size: 1.3rem;
            color: rgba(255,255,255,0.9);
            margin-bottom: 2rem;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
        }
        
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.6s ease;
            opacity: 0;
        }
        
        .card:hover::before {
            animation: shimmer 0.6s ease;
        }
        
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%) rotate(45deg); opacity: 0; }
        }
        
        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
            animation: float 3s ease-in-out infinite;
        }
        
        .card:nth-child(2) .card-icon { animation-delay: -1s; }
        .card:nth-child(3) .card-icon { animation-delay: -2s; }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .card h3 {
            color: white;
            margin-bottom: 1rem;
            font-size: 1.4rem;
        }
        
        .card p {
            color: rgba(255,255,255,0.8);
            line-height: 1.6;
        }
        
        .metric {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4ade80;
            margin: 1rem 0;
            text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
        }
        
        .chat-section {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-bottom: 3rem;
        }
        
        .chat-header {
            color: white;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .chat-messages {
            height: 300px;
            overflow-y: auto;
            margin-bottom: 1rem;
            padding: 1rem;
            background: rgba(0,0,0,0.1);
            border-radius: 15px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
        
        .message {
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 15px;
            animation: messageSlide 0.3s ease;
        }
        
        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .user-message {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin-left: 20%;
        }
        
        .ai-message {
            background: rgba(255,255,255,0.9);
            color: #333;
            margin-right: 20%;
        }
        
        .chat-input-container {
            display: flex;
            gap: 1rem;
        }
        
        .chat-input {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 25px;
            background: rgba(255,255,255,0.9);
            font-size: 1rem;
            outline: none;
        }
        
        .send-btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 25px;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(74, 222, 128, 0.3);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .feature-card:hover {
            transform: scale(1.02);
            background: rgba(255, 255, 255, 0.15);
        }
        
        .feature-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .feature-title {
            color: white;
            font-size: 1.3rem;
            margin-bottom: 1rem;
        }
        
        .feature-desc {
            color: rgba(255,255,255,0.8);
            line-height: 1.6;
        }
        
        .loading {
            display: none;
            color: rgba(255,255,255,0.7);
            font-style: italic;
        }
        
        .loading.show {
            display: block;
        }
        
        .typing-indicator {
            background: rgba(255,255,255,0.9);
            border-radius: 15px;
            padding: 1rem;
            margin-right: 20%;
            margin-bottom: 1rem;
            display: none;
        }
        
        .typing-indicator.show {
            display: block;
            animation: messageSlide 0.3s ease;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: #666;
            border-radius: 50%;
            animation: typingPulse 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typingPulse {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .status-bar {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            font-size: 0.9rem;
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">🤖 NAItive AI Workspace Hub</h1>
            <p class="tagline">Intelligent productivity powered by Cloudflare Workers & Google Workspace</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <span class="card-icon">📊</span>
                <h3>Productivity Score</h3>
                <div class="metric" id="productivity-score">--</div>
                <p>Your AI-analyzed productivity metrics for today</p>
            </div>
            
            <div class="card">
                <span class="card-icon">📅</span>
                <h3>Smart Calendar</h3>
                <div class="metric" id="meetings-today">--</div>
                <p>AI-optimized meetings scheduled with intelligent conflict resolution</p>
            </div>
            
            <div class="card">
                <span class="card-icon">⚡</span>
                <h3>Workflow Automation</h3>
                <div class="metric" id="automations">--</div>
                <p>Active automations saving you time across Google Workspace</p>
            </div>
        </div>
        
        <div class="chat-section">
            <div class="chat-header">
                <span>🧠</span>
                <span>AI Assistant</span>
                <span class="pulse" style="margin-left: auto; color: #4ade80;">● Online</span>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <div class="message ai-message">
                    <strong>NAI Assistant:</strong> Welcome! I'm your AI-powered workspace assistant. I can help you analyze productivity, manage your Google Workspace, and automate workflows. What would you like to accomplish today?
                </div>
            </div>
            
            <div class="typing-indicator" id="typing-indicator">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chat-input" placeholder="Ask me anything about your workspace..." />
                <button class="send-btn" id="send-btn">Send</button>
            </div>
        </div>
        
        <div class="features-grid">
            <div class="feature-card">
                <span class="feature-icon">🔗</span>
                <h3 class="feature-title">Google Workspace Integration</h3>
                <p class="feature-desc">Seamlessly connected to Gmail, Calendar, Drive, and Docs with real-time synchronization</p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🎯</span>
                <h3 class="feature-title">Smart Analytics</h3>
                <p class="feature-desc">AI-powered insights into your productivity patterns and workflow optimization</p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🤖</span>
                <h3 class="feature-title">Intelligent Automation</h3>
                <p class="feature-desc">Automate repetitive tasks with advanced AI that learns from your behavior</p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🔐</span>
                <h3 class="feature-title">Enterprise Security</h3>
                <p class="feature-desc">Bank-level security with Google Workspace SSO and Cloudflare protection</p>
            </div>
        </div>
    </div>
    
    <div class="status-bar">
        <div>🌍 Global Edge Deployment</div>
        <div>⚡ 99.99% Uptime SLA</div>
        <div>🔒 Zero Trust Security</div>
    </div>
    
    <script>
        // Initialize dashboard with real-time data
        async function loadAnalytics() {
            try {
                const response = await fetch('/api/analytics');
                const data = await response.json();
                
                // Update metrics with animation
                animateMetric('productivity-score', data.productivity.score + '%');
                animateMetric('meetings-today', data.meetings.today + ' today');
                animateMetric('automations', (data.documents.created + data.emails.processed) + ' active');
                
            } catch (error) {
                console.error('Failed to load analytics:', error);
            }
        }
        
        function animateMetric(elementId, value) {
            const element = document.getElementById(elementId);
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                element.textContent = value;
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Chat functionality
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const typingIndicator = document.getElementById('typing-indicator');
        
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            typingIndicator.classList.add('show');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                
                const data = await response.json();
                
                // Hide typing indicator and add AI response
                setTimeout(() => {
                    typingIndicator.classList.remove('show');
                    addMessage(data.response, 'ai');
                }, 1500);
                
            } catch (error) {
                typingIndicator.classList.remove('show');
                addMessage('Sorry, I\\'m having trouble connecting right now. Please try again!', 'ai');
            }
        }
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}-message\`;
            messageDiv.innerHTML = \`<strong>\${sender === 'user' ? 'You' : 'NAI Assistant'}:</strong> \${text}\`;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Event listeners
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        
        // Auto-suggestions
        const suggestions = [
            "How productive was I this week?",
            "Schedule a team meeting for next week",
            "Analyze my email response times",
            "What tasks can I automate?",
            "Show me my calendar optimization",
            "Generate a productivity report"
        ];
        
        chatInput.addEventListener('focus', () => {
            if (!chatInput.value) {
                const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                chatInput.placeholder = randomSuggestion;
            }
        });
        
        // Initialize everything
        document.addEventListener('DOMContentLoaded', () => {
            loadAnalytics();
            
            // Refresh analytics every 30 seconds
            setInterval(loadAnalytics, 30000);
            
            // Add some sample interaction
            setTimeout(() => {
                if (chatMessages.children.length === 1) {
                    addMessage("I see you're exploring the NAItive AI Workspace Hub! This demo showcases our Google Workspace integration capabilities. Try asking me about productivity insights!", 'ai');
                }
            }, 3000);
        });
        
        // Easter egg: Konami code
        let konamiCode = [];
        const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            if (konamiCode.length > konami.length) {
                konamiCode = konamiCode.slice(-konami.length);
            }
            if (konamiCode.join(',') === konami.join(',')) {
                document.body.style.animation = 'rainbow 2s infinite';
                addMessage("🎉 Easter egg activated! You found the secret developer mode!", 'ai');
            }
        });
        
        // Add rainbow animation for easter egg
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>
  `;
} 