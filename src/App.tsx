import React, { useState } from 'react';
import { Calculator, TrendingUp, BarChart3, PieChart, FileText, Download } from 'lucide-react';
import Dashboard from './components/Dashboard';
import IncomeStatement from './components/IncomeStatement';
import BalanceSheet from './components/BalanceSheet';
import CashFlowStatement from './components/CashFlowStatement';
import Scenarios from './components/Scenarios';
import { FinancialData, ScenarioData } from './types/financial';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: Array(5).fill(0),
    cogs: Array(5).fill(0),
    operatingExpenses: Array(5).fill(0),
    depreciation: Array(5).fill(0),
    interest: Array(5).fill(0),
    taxes: Array(5).fill(0),
    assets: Array(5).fill(0),
    liabilities: Array(5).fill(0),
    equity: Array(5).fill(0),
    cashFlow: Array(5).fill(0),
    years: [2024, 2025, 2026, 2027, 2028]
  });

  const [scenarios, setScenarios] = useState<ScenarioData[]>([
    { id: '1', name: 'Base Case', revenueGrowth: 15, marginImprovement: 2 },
    { id: '2', name: 'Optimistic', revenueGrowth: 25, marginImprovement: 5 },
    { id: '3', name: 'Conservative', revenueGrowth: 8, marginImprovement: 0 }
  ]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'income', name: 'Income Statement', icon: TrendingUp },
    { id: 'balance', name: 'Balance Sheet', icon: Calculator },
    { id: 'cashflow', name: 'Cash Flow', icon: PieChart },
    { id: 'scenarios', name: 'Scenarios', icon: FileText }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard financialData={financialData} scenarios={scenarios} />;
      case 'income':
        return <IncomeStatement financialData={financialData} setFinancialData={setFinancialData} />;
      case 'balance':
        return <BalanceSheet financialData={financialData} setFinancialData={setFinancialData} />;
      case 'cashflow':
        return <CashFlowStatement financialData={financialData} setFinancialData={setFinancialData} />;
      case 'scenarios':
        return <Scenarios scenarios={scenarios} setScenarios={setScenarios} financialData={financialData} />;
      default:
        return <Dashboard financialData={financialData} scenarios={scenarios} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Financial Model Builder</h1>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Model
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;