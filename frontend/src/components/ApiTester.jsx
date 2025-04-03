import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Component to test API connectivity
 * Use this for debugging connection issues
 */
const ApiTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com';
  
  // Define endpoints to test
  const endpointsToTest = [
    { url: `${apiBaseUrl}/health`, name: 'Health Check' },
    { url: `${apiBaseUrl}/api/ping`, name: 'API Ping' },
    { url: `${apiBaseUrl}/`, name: 'Root Endpoint' },
    { url: `${apiBaseUrl}/api/debug`, name: 'Debug Endpoint' }
  ];

  // Function to test a single endpoint
  const testEndpoint = async (endpoint) => {
    try {
      setResults(prev => ({ ...prev, [endpoint.name]: { status: 'loading' } }));
      const response = await axios.get(endpoint.url, { 
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      setResults(prev => ({ 
        ...prev, 
        [endpoint.name]: { 
          status: 'success', 
          statusCode: response.status,
          data: response.data,
          time: new Date().toLocaleTimeString()
        } 
      }));
      return true;
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [endpoint.name]: { 
          status: 'error', 
          message: error.message,
          time: new Date().toLocaleTimeString()
        } 
      }));
      return false;
    }
  };

  // Run all endpoint tests
  const runAllTests = async () => {
    setLoading(true);
    for (const endpoint of endpointsToTest) {
      await testEndpoint(endpoint);
    }
    setLoading(false);
  };

  // Test custom URL
  const testCustomUrl = async () => {
    if (!customUrl) return;
    
    const endpoint = { url: customUrl, name: 'Custom URL' };
    setLoading(true);
    await testEndpoint(endpoint);
    setLoading(false);
  };

  // Run tests on component mount
  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>API Connection Tester</h2>
      <p>Base URL: {apiBaseUrl}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test All Endpoints'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={customUrl} 
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="Enter custom URL to test"
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button 
          onClick={testCustomUrl}
          disabled={loading || !customUrl}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || !customUrl) ? 'not-allowed' : 'pointer'
          }}
        >
          Test URL
        </button>
      </div>

      <h3>Test Results:</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Object.entries(results).map(([name, result]) => (
          <div 
            key={name}
            style={{ 
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px',
              backgroundColor: result.status === 'success' ? '#d4edda' : 
                              result.status === 'loading' ? '#fff3cd' : '#f8d7da'
            }}
          >
            <h4 style={{ margin: '0 0 5px 0' }}>{name}</h4>
            <p style={{ margin: '0 0 5px 0' }}>Status: {result.status}</p>
            {result.statusCode && <p style={{ margin: '0 0 5px 0' }}>Status code: {result.statusCode}</p>}
            {result.message && <p style={{ margin: '0 0 5px 0' }}>Error: {result.message}</p>}
            <p style={{ margin: '0', fontSize: '12px', color: '#6c757d' }}>Time: {result.time}</p>
            
            {result.data && (
              <div style={{ marginTop: '10px' }}>
                <details>
                  <summary>Response Data</summary>
                  <pre style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTester;
