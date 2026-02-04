import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import CategorySummary from './components/CategorySummary';
import Accounts from './components/Accounts';
import { FaHome, FaChartBar, FaList, FaWallet } from 'react-icons/fa';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'home', label: 'Transactions', icon: FaHome },
    { id: 'summary', label: 'Summary', icon: FaList },
    { id: 'accounts', label: 'Accounts', icon: FaWallet },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'home':
        return <Home />;
      case 'summary':
        return <CategorySummary />;
      case 'accounts':
        return <Accounts />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">Money Manager</h1>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-2 text-sm" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 text-sm" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
