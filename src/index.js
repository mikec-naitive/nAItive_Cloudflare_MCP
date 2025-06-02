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
            to { text-shadow: 0 0 40px rgba(255,255,255,0.6); }
        }
        
        .tagline {
            font-size: 1.3rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: left 0.5s;
        }
        
        .card:hover::before {
            left: 100%;
        }
        
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .card-icon {
            font-size: 2rem;
            margin-right: 1rem;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        .card-title {
            font-size: 1.4rem;
            font-weight: 600;
            color: white;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1rem 0;
            padding: 0.8rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        
        .metric-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: #4ade80;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .chat-interface {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .chat-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .status-indicator {
            width: 10px;
            height: 10px;
            background: #4ade80;
            border-radius: 50%;
            margin-right: 0.5rem;
            animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
        }
        
        .chat-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 1rem 1.5rem;
            color: white;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .chat-input:focus {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.4);
            transform: scale(1.02);
        }
        
        .chat-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .footer {
            text-align: center;
            margin-top: 3rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .rainbow {
            background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            background-size: 400% 400%;
            animation: rainbowShift 2s ease infinite;
        }
        
        @keyframes rainbowShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .konami-trigger {
            position: fixed;
            top: -9999px;
            left: -9999px;
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .logo { font-size: 2rem; }
            .dashboard { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="logo">🚀 NAItive AI Workspace Hub</h1>
            <p class="tagline">Intelligent Productivity • Real-time Analytics • Google Workspace Integration</p>
        </header>
        
        <div class="dashboard" id="dashboard">
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📊</span>
                    <h3 class="card-title">Productivity Analytics</h3>
                </div>
                <div class="metric">
                    <span>Today's Score</span>
                    <span class="metric-value" id="productivity-score">--</span>
                </div>
                <div class="metric">
                    <span>Weekly Trend</span>
                    <span class="metric-value" id="weekly-trend">--</span>
                </div>
                <div class="metric">
                    <span>Focus Time</span>
                    <span class="metric-value" id="focus-time">--</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📅</span>
                    <h3 class="card-title">Calendar Intelligence</h3>
                </div>
                <div class="metric">
                    <span>Meetings Today</span>
                    <span class="metric-value" id="meetings-today">--</span>
                </div>
                <div class="metric">
                    <span>This Week</span>
                    <span class="metric-value" id="meetings-week">--</span>
                </div>
                <div class="metric">
                    <span>Avg Duration</span>
                    <span class="metric-value" id="avg-duration">--</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📧</span>
                    <h3 class="card-title">Email Insights</h3>
                </div>
                <div class="metric">
                    <span>Unread</span>
                    <span class="metric-value" id="unread-emails">--</span>
                </div>
                <div class="metric">
                    <span>Processed</span>
                    <span class="metric-value" id="processed-emails">--</span>
                </div>
                <div class="metric">
                    <span>Response Time</span>
                    <span class="metric-value" id="response-time">--</span>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🤖</span>
                    <h3 class="card-title">AI Assistant</h3>
                </div>
                <div class="chat-interface">
                    <div class="chat-header">
                        <div class="status-indicator"></div>
                        <span style="color: rgba(255,255,255,0.9);">AI Assistant Online</span>
                    </div>
                    <input type="text" class="chat-input" id="ai-input" 
                           placeholder="Ask me anything about your workspace..." 
                           onkeypress="handleChatInput(event)">
                    <div id="ai-response" style="margin-top: 1rem; color: rgba(255,255,255,0.8);"></div>
                </div>
            </div>
        </div>
        
        <footer class="footer">
            <p>🔐 Secured by Cloudflare • ✨ Enhanced by AI • 🌍 Edge Computing</p>
            <p style="margin-top: 0.5rem; font-size: 0.9rem;">Production Environment | Google Workspace Authentication Ready</p>
        </footer>
    </div>
    
    <input type="text" class="konami-trigger" id="konami-trigger">
    
    <script>
        // Konami Code Easter Egg
        let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', function(e) {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    document.body.classList.add('rainbow');
                    setTimeout(() => document.body.classList.remove('rainbow'), 5000);
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
        
        // Load analytics data
        async function loadAnalytics() {
            try {
                const response = await fetch('/api/analytics');
                const data = await response.json();
                
                document.getElementById('productivity-score').textContent = data.productivity.score + '%';
                document.getElementById('weekly-trend').textContent = '↗ +' + data.productivity.change + '%';
                document.getElementById('focus-time').textContent = '4.2h';
                document.getElementById('meetings-today').textContent = data.meetings.today;
                document.getElementById('meetings-week').textContent = data.meetings.thisWeek;
                document.getElementById('avg-duration').textContent = data.meetings.avgDuration + 'm';
                document.getElementById('unread-emails').textContent = data.emails.unread;
                document.getElementById('processed-emails').textContent = data.emails.processed;
                document.getElementById('response-time').textContent = data.emails.responseTime + 'm';
            } catch (error) {
                console.log('Analytics loading failed, using demo data');
            }
        }
        
        // Handle AI chat
        async function handleChatInput(event) {
            if (event.key === 'Enter') {
                const input = event.target;
                const message = input.value.trim();
                if (!message) return;
                
                const responseDiv = document.getElementById('ai-response');
                responseDiv.innerHTML = '<span style="opacity: 0.6;">🤔 AI is thinking...</span>';
                
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    responseDiv.innerHTML = '💡 ' + data.response;
                } catch (error) {
                    responseDiv.innerHTML = '⚠️ AI temporarily unavailable. Please try again.';
                }
                
                input.value = '';
            }
        }
        
        // Auto-refresh analytics
        loadAnalytics();
        setInterval(loadAnalytics, 30000);
        
        // Add some dynamic visual effects
        setInterval(() => {
            document.querySelectorAll('.metric-value').forEach(el => {
                if (Math.random() > 0.7) {
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => el.style.transform = 'scale(1)', 200);
                }
            });
        }, 5000);
    </script>
</body>
</html>
  `;
} 