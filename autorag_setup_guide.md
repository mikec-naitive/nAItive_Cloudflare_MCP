# AutoRAG Testing Setup Guide

## Overview
This guide walks through testing the complete AutoRAG workflow using available MCP tools and Cloudflare dashboard for components not yet available via MCP.

## Available MCP Tools
The current Cloudflare Bindings MCP server provides:
- ✅ KV namespace management
- ✅ Workers management  
- ✅ Account management
- ❌ R2 bucket management (requires dashboard or separate MCP server)
- ❌ AutoRAG management (requires dashboard or separate MCP server)

## Setup Steps

### 1. Prerequisites ✅ COMPLETED
- [x] Cloudflare account: `07e04ba84923cf1badc9313a7090f93c`
- [x] Test document created: `test_document.md`
- [x] KV namespace created: `autorag-test-documents` (ID: `786e28675b494719a60642147c4d80e8`)

### 2. R2 Bucket Creation (Manual)
Since R2 management isn't available in current MCP tools:

1. Navigate to [Cloudflare Dashboard > R2](https://dash.cloudflare.com/?to=/:account/r2)
2. Create bucket: `autorag-test-bucket`
3. Upload `test_document.md` to the bucket

**Alternative**: Use Wrangler CLI:
```bash
npx wrangler r2 bucket create autorag-test-bucket
npx wrangler r2 object put autorag-test-bucket/test_document.md --file test_document.md
```

### 3. AutoRAG Instance Creation (Manual)
1. Navigate to [Cloudflare Dashboard > AI > AutoRAG](https://dash.cloudflare.com/?to=/:account/ai/autorag)
2. Create AutoRAG instance:
   - Name: `naitive-test-autorag`
   - Data source: R2 bucket `autorag-test-bucket`
   - Embedding model: Default
   - LLM: Default
3. Wait for indexing to complete

### 4. API Token Setup
Create API token with AutoRAG permissions:
1. Go to [Cloudflare Dashboard > My Profile > API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Create token with:
   - AutoRAG:Read
   - AutoRAG:Edit
   - Account:Read

### 5. Testing RAG Functionality

#### Test Queries
```javascript
const testQueries = [
  "What services does NAItive offer?",
  "How do I authenticate with the API?", 
  "What are the main API endpoints?",
  "Tell me about the workflow builder features",
  "How do I troubleshoot authentication errors?"
];
```

#### API Test Script
Use the provided `autorag_test_script.js` with your API token:

```bash
# Update API_TOKEN in autorag_test_script.js
node autorag_test_script.js
```

### 6. Full MCP Integration (Future)
For complete MCP automation, need additional MCP servers:

**`.cursor/mcp.json` configuration:**
```json
{
  "mcpServers": {
    "cloudflare-bindings": {
      "command": "npx", 
      "args": ["mcp-remote", "https://bindings.mcp.cloudflare.com/sse"]
    },
    "cloudflare-autorag": {
      "command": "npx",
      "args": ["mcp-remote", "https://autorag.mcp.cloudflare.com/sse"] 
    }
  }
}
```

## Current State
- ✅ Linear issue created: NAI-21
- ✅ Test document created and ready
- ✅ KV namespace created for temporary storage
- ✅ Documentation research completed
- ⚠️ R2 bucket creation pending (manual step)
- ⚠️ AutoRAG instance creation pending (manual step)
- ⚠️ End-to-end testing pending

## Expected Results
After completing setup:
1. AutoRAG can retrieve relevant content from uploaded document
2. Generated responses include accurate information from test document
3. Query-response pairs demonstrate working RAG functionality
4. Complete workflow is documented for future automation

## Troubleshooting
- **Missing R2 tools**: Current MCP server focuses on KV/Workers, use dashboard or Wrangler
- **AutoRAG creation**: Currently requires dashboard, may be available in separate MCP server
- **Authentication**: Ensure API token has correct permissions for AutoRAG

## Next Steps for Full Automation
1. Get access to full Cloudflare MCP server with R2 management
2. Configure AutoRAG MCP server for programmatic management
3. Create end-to-end automated workflow using MCP tools only 