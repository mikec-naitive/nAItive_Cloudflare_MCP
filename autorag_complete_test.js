#!/usr/bin/env node

/**
 * Complete AutoRAG Testing Script
 * 
 * This script performs the complete AutoRAG workflow:
 * 1. Uploads test document to R2 bucket via S3-compatible API
 * 2. Creates AutoRAG instance (manual step - provides instructions)
 * 3. Tests RAG queries via AutoRAG REST API
 * 4. Validates results
 */

const fs = require('fs');
const https = require('https');

// Configuration - Update these values
const CONFIG = {
    ACCOUNT_ID: '07e04ba84923cf1badc9313a7090f93c',
    API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || 'YOUR_API_TOKEN_HERE',
    R2_BUCKET: 'autorag-test-bucket',
    R2_REGION: 'auto', // or 'wnam', 'enam', 'weur', 'eeur', 'apac'
    AUTORAG_NAME: 'naitive-test-rag',
    TEST_DOCUMENT: 'test_document.md'
};

class AutoRAGTester {
    constructor() {
        this.baseURL = `https://api.cloudflare.com/client/v4/accounts/${CONFIG.ACCOUNT_ID}`;
        this.r2Endpoint = `https://${CONFIG.ACCOUNT_ID}.r2.cloudflarestorage.com`;
    }

    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const req = https.request(url, {
                method: options.method || 'GET',
                headers: {
                    'Authorization': `Bearer ${CONFIG.API_TOKEN}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve({ status: res.statusCode, data: result });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: data });
                    }
                });
            });

            req.on('error', reject);
            
            if (options.body) {
                req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
            }
            
            req.end();
        });
    }

    async uploadToR2(filePath, key) {
        console.log(`📄 Uploading ${filePath} to R2 bucket...`);
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileContent = fs.readFileSync(filePath);
        const url = `${this.r2Endpoint}/${CONFIG.R2_BUCKET}/${key}`;

        return new Promise((resolve, reject) => {
            const req = https.request(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${CONFIG.API_TOKEN}`,
                    'Content-Type': 'text/markdown',
                    'Content-Length': fileContent.length
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log(`✅ Successfully uploaded ${key} to R2`);
                        resolve({ success: true, status: res.statusCode });
                    } else {
                        console.error(`❌ Failed to upload to R2: ${res.statusCode} - ${data}`);
                        reject(new Error(`Upload failed: ${res.statusCode}`));
                    }
                });
            });

            req.on('error', reject);
            req.write(fileContent);
            req.end();
        });
    }

    async listAutoRAGs() {
        console.log('📋 Listing existing AutoRAG instances...');
        const url = `${this.baseURL}/autorag/rags`;
        
        try {
            const response = await this.makeRequest(url);
            if (response.data.success) {
                console.log(`Found ${response.data.result.length} AutoRAG instances`);
                return response.data.result;
            } else {
                console.error('Failed to list AutoRAGs:', response.data.errors);
                return [];
            }
        } catch (error) {
            console.error('Error listing AutoRAGs:', error.message);
            return [];
        }
    }

    async testRAGQuery(autoragName, query) {
        console.log(`🔍 Testing RAG query: "${query}"`);
        const url = `${this.baseURL}/autorag/rags/${autoragName}/ai-search`;
        
        const requestBody = {
            query: query,
            max_num_results: 5,
            ranking_options: {
                score_threshold: 0.3
            },
            stream: false
        };

        try {
            const response = await this.makeRequest(url, {
                method: 'POST',
                body: requestBody
            });

            if (response.status === 200 && response.data.success) {
                console.log('✅ RAG Query Successful!');
                console.log('📊 Results:', JSON.stringify(response.data.result, null, 2));
                return response.data.result;
            } else {
                console.error('❌ RAG Query Failed:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error in RAG query:', error.message);
            return null;
        }
    }

    async searchOnly(autoragName, query) {
        console.log(`🔍 Testing search-only query: "${query}"`);
        const url = `${this.baseURL}/autorag/rags/${autoragName}/search`;
        
        const requestBody = {
            query: query,
            max_num_results: 5,
            ranking_options: {
                score_threshold: 0.3
            }
        };

        try {
            const response = await this.makeRequest(url, {
                method: 'POST',
                body: requestBody
            });

            if (response.status === 200 && response.data.success) {
                console.log('✅ Search Query Successful!');
                console.log('📊 Search Results:', JSON.stringify(response.data.result, null, 2));
                return response.data.result;
            } else {
                console.error('❌ Search Query Failed:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error in search query:', error.message);
            return null;
        }
    }

    printInstructions() {
        console.log('\n📋 MANUAL STEPS REQUIRED:');
        console.log('==========================');
        console.log('1. Go to: https://dash.cloudflare.com/?to=/:account/ai/autorag');
        console.log('2. Click "Create AutoRAG"');
        console.log(`3. Select R2 bucket: "${CONFIG.R2_BUCKET}"`);
        console.log('4. Choose embedding model (default recommended)');
        console.log('5. Choose LLM model (default recommended)');
        console.log('6. Create or select AI Gateway');
        console.log(`7. Name your AutoRAG: "${CONFIG.AUTORAG_NAME}"`);
        console.log('8. Create Service API token (if needed)');
        console.log('9. Click "Create" and wait for indexing to complete');
        console.log('10. Re-run this script with --test-only flag\n');
    }

    async run() {
        const args = process.argv.slice(2);
        const testOnly = args.includes('--test-only');

        console.log('🚀 AutoRAG Complete Testing Script');
        console.log('=====================================\n');

        if (CONFIG.API_TOKEN === 'YOUR_API_TOKEN_HERE') {
            console.error('❌ Please set CLOUDFLARE_API_TOKEN environment variable or update CONFIG.API_TOKEN');
            process.exit(1);
        }

        if (!testOnly) {
            // Step 1: Upload document to R2
            try {
                await this.uploadToR2(CONFIG.TEST_DOCUMENT, 'documents/test_document.md');
            } catch (error) {
                console.error('❌ Failed to upload document:', error.message);
                console.log('💡 Tip: Make sure the file exists and your API token has R2 permissions');
                return;
            }

            // Step 2: Instructions for creating AutoRAG (manual step)
            this.printInstructions();
            return;
        }

        // Step 3: Test RAG queries (when --test-only flag is used)
        console.log('🧪 Testing AutoRAG queries...\n');

        // List existing AutoRAGs
        const autoRAGs = await this.listAutoRAGs();
        
        const testQueries = [
            "What is NAItive and what services do they offer?",
            "How do I authenticate with the NAItive API?",
            "What are the main features of the workflow builder?",
            "What are best practices for data security?",
            "How do I troubleshoot authentication errors?"
        ];

        console.log(`\n🔬 Running ${testQueries.length} test queries...\n`);

        for (const query of testQueries) {
            console.log(`\n--- Query: ${query} ---`);
            
            // Test AI Search (with generation)
            const aiResult = await this.testRAGQuery(CONFIG.AUTORAG_NAME, query);
            
            // Test Search Only (retrieval only)
            const searchResult = await this.searchOnly(CONFIG.AUTORAG_NAME, query);
            
            console.log(''); // spacing
        }

        console.log('\n✅ AutoRAG testing complete!');
        console.log('📊 Check the results above to verify AutoRAG is working correctly.');
    }
}

// Environment check
if (require.main === module) {
    const tester = new AutoRAGTester();
    tester.run().catch(error => {
        console.error('💥 Script failed:', error.message);
        process.exit(1);
    });
}

module.exports = AutoRAGTester; 