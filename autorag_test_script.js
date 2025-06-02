// AutoRAG Test Script
// This script demonstrates how to upload a document to R2 and test AutoRAG functionality

const ACCOUNT_ID = '07e04ba84923cf1badc9313a7090f93c';
const API_TOKEN = 'YOUR_API_TOKEN_HERE'; // Need to get from Cloudflare dashboard
const AUTORAG_NAME = 'naitive-test-rag';

/**
 * Step 1: Upload document to R2 bucket
 * Note: This requires an R2 bucket to be created first via Cloudflare dashboard
 */
async function uploadDocumentToR2(bucketName, fileName, content) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${bucketName}/objects/${fileName}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'text/markdown'
    },
    body: content
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
  
  console.log(`✅ Document uploaded to R2: ${fileName}`);
  return await response.json();
}

/**
 * Step 2: Create AutoRAG instance (via dashboard or API)
 * Note: AutoRAG creation might need to be done via dashboard initially
 */
async function createAutoRAG(name, bucketName) {
  // This would typically be done via the Cloudflare dashboard
  // AutoRAG API for creation might not be available yet
  console.log(`📝 AutoRAG creation for ${name} should be done via Cloudflare dashboard`);
  console.log(`- Navigate to AI > AutoRAG in Cloudflare dashboard`);
  console.log(`- Create new AutoRAG linked to bucket: ${bucketName}`);
  console.log(`- Wait for indexing to complete`);
}

/**
 * Step 3: Test AutoRAG AI Search
 */
async function testAutoRAGSearch(query) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/autorag/rags/${AUTORAG_NAME}/ai-search`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({
      query: query,
      model: '@cf/meta/llama-3.3-70b-instruct-sd',
      rewrite_query: false,
      max_num_results: 10,
      ranking_options: {
        score_threshold: 0.3
      },
      stream: false
    })
  });
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log(`🔍 AutoRAG Search Results for: "${query}"`);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * Step 4: Test AutoRAG basic search (without generation)
 */
async function testAutoRAGBasicSearch(query) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/autorag/rags/${AUTORAG_NAME}/search`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({
      query: query,
      max_num_results: 5,
      ranking_options: {
        score_threshold: 0.3
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Basic search failed: ${response.status} ${response.statusText}`);
  }
  
  const result = await response.json();
  console.log(`📊 AutoRAG Basic Search Results for: "${query}"`);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * Main test function
 */
async function runAutoRAGTest() {
  try {
    console.log('🚀 Starting AutoRAG Test Flow');
    console.log('================================');
    
    // Test queries to run against our document
    const testQueries = [
      "What services does NAItive offer?",
      "How do I authenticate with the API?",
      "What are the main API endpoints?",
      "Tell me about the workflow builder features",
      "How do I troubleshoot authentication errors?"
    ];
    
    console.log('📋 Test Queries to Run:');
    testQueries.forEach((query, index) => {
      console.log(`${index + 1}. ${query}`);
    });
    
    console.log('\n⚠️  Prerequisites to complete manually:');
    console.log('1. Create R2 bucket in Cloudflare dashboard');
    console.log('2. Upload test_document.md to the bucket');
    console.log('3. Create AutoRAG instance pointing to the bucket');
    console.log('4. Get API token with AutoRAG permissions');
    console.log('5. Wait for AutoRAG indexing to complete');
    
    console.log('\n🔧 Once prerequisites are complete, run:');
    testQueries.forEach(async (query, index) => {
      console.log(`\n--- Test ${index + 1} ---`);
      try {
        // Uncomment these when ready to test with actual AutoRAG
        // await testAutoRAGBasicSearch(query);
        // await testAutoRAGSearch(query);
        console.log(`Would test: "${query}"`);
      } catch (error) {
        console.error(`❌ Test ${index + 1} failed:`, error.message);
      }
    });
    
    console.log('\n✅ AutoRAG test script completed');
    
  } catch (error) {
    console.error('❌ AutoRAG test failed:', error.message);
  }
}

// Export for use or run directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAutoRAGTest,
    testAutoRAGSearch,
    testAutoRAGBasicSearch,
    uploadDocumentToR2,
    createAutoRAG
  };
} else {
  // Run test if executed directly
  runAutoRAGTest();
} 