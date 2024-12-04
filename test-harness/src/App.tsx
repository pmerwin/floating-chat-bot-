import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { FloatingChatBot } from 'floating-chat-bot';
import './index.css';

// Move components to top-level scope

// Sample pages
const Product = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Premium Widget PRO</h1>
    <p className="mb-4">
      Experience the next generation of widget technology with our Premium Widget PRO. 
      This cutting-edge solution offers unparalleled performance and reliability.
    </p>
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Key Features:</h2>
      <ul className="list-disc pl-5">
        <li>Advanced AI-powered optimization</li>
        <li>Real-time analytics dashboard</li>
        <li>Enterprise-grade security</li>
        <li>24/7 priority support</li>
      </ul>
    </div>
  </div>
);

const Documentation = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
        <p>
          To begin using our API, you'll need to obtain an API key from your dashboard.
          All requests should be made to the base URL: https://api.example.com/v1
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Authentication</h2>
        <p>
          Include your API key in the Authorization header of all requests:
          Authorization: Bearer YOUR_API_KEY
        </p>
      </section>
    </div>
  </div>
);

const Support = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Customer Support</h1>
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-2">Common Issues</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">Installation Problems</h3>
            <p>Make sure you have the latest version installed and your system meets the minimum requirements.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Account Access</h3>
            <p>If you're having trouble logging in, try resetting your password or clearing your browser cache.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Test Harness</span>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="hidden sm:flex sm:items-center">
            <Link 
              to="/product"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/product' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Product
            </Link>
            <Link 
              to="/docs"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/docs' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Documentation
            </Link>
            <Link 
              to="/support"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/support' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Support
            </Link>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/product"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/product' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Product
            </Link>
            <Link 
              to="/docs"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/docs' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Documentation
            </Link>
            <Link 
              to="/support"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/support' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Support
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

function App() {
  const [isChatEnabled, setIsChatEnabled] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsChatEnabled(!isChatEnabled)}
            className={`px-4 py-2 rounded-md font-medium ${
              isChatEnabled 
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isChatEnabled ? 'Disable Chat' : 'Enable Chat'}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/product" element={<Product />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/support" element={<Support />} />
        </Routes>

        {isChatEnabled && (
          <FloatingChatBot
            agentId="BEPYL2REX7"
            agentAlias="TSTALIASID"
            apiEndpoint="/chat"
            position="bottom-right"
          />
        )}
      </div>
    </Router>
  );
}

export default App;