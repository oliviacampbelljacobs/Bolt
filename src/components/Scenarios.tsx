import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { ScenarioData, FinancialData } from '../types/financial';

interface ScenariosProps {
  scenarios: ScenarioData[];
  setScenarios: React.Dispatch<React.SetStateAction<ScenarioData[]>>;
  financialData: FinancialData;
}

const Scenarios: React.FC<ScenariosProps> = ({ 
  scenarios, 
  setScenarios, 
  financialData 
}) => {
  const [newScenario, setNewScenario] = useState({
    name: '',
    revenueGrowth: 0,
    marginImprovement: 0
  });

  const addScenario = () => {
    if (newScenario.name.trim()) {
      const scenario: ScenarioData = {
        id: Date.now().toString(),
        name: newScenario.name,
        revenueGrowth: newScenario.revenueGrowth,
        marginImprovement: newScenario.marginImprovement
      };
      setScenarios(prev => [...prev, scenario]);
      setNewScenario({ name: '', revenueGrowth: 0, marginImprovement: 0 });
    }
  };

  const removeScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const updateScenario = (id: string, updates: Partial<ScenarioData>) => {
    setScenarios(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const calculateProjectedRevenue = (scenario: ScenarioData, yearIndex: number) => {
    const baseRevenue = financialData.revenue[0] || 1000000;
    return baseRevenue * Math.pow(1 + scenario.revenueGrowth / 100, yearIndex + 1);
  };

  const calculateProjectedMargin = (scenario: ScenarioData) => {
    const baseMargin = financialData.revenue[0] > 0 
      ? ((financialData.revenue[0] - financialData.cogs[0]) / financialData.revenue[0]) * 100
      : 30;
    return Math.min(baseMargin + scenario.marginImprovement, 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Scenario Analysis</h2>
        <div className="text-sm text-gray-500">
          Model different business scenarios
        </div>
      </div>

      {/* Add New Scenario */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name
            </label>
            <input
              type="text"
              value={newScenario.name}
              onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., Bull Case"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue Growth (%)
            </label>
            <input
              type="number"
              value={newScenario.revenueGrowth}
              onChange={(e) => setNewScenario(prev => ({ ...prev, revenueGrowth: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Margin Improvement (%)
            </label>
            <input
              type="number"
              value={newScenario.marginImprovement}
              onChange={(e) => setNewScenario(prev => ({ ...prev, marginImprovement: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addScenario}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <input
                  type="text"
                  value={scenario.name}
                  onChange={(e) => updateScenario(scenario.id, { name: e.target.value })}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:border-b focus:border-blue-500"
                />
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    {scenario.revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span>{scenario.revenueGrowth}% growth</span>
                  </div>
                  <div>+{scenario.marginImprovement}% margin</div>
                </div>
              </div>
              <button
                onClick={() => removeScenario(scenario.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Scenario Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Revenue Growth (%)
                </label>
                <input
                  type="number"
                  value={scenario.revenueGrowth}
                  onChange={(e) => updateScenario(scenario.id, { revenueGrowth: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Margin Improvement (%)
                </label>
                <input
                  type="number"
                  value={scenario.marginImprovement}
                  onChange={(e) => updateScenario(scenario.id, { marginImprovement: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Projected Results */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Projected Revenue (Year 2):</span>
                <span className="font-semibold">
                  ${(calculateProjectedRevenue(scenario, 1) / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Projected Margin:</span>
                <span className="font-semibold">
                  {calculateProjectedMargin(scenario).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">5-Year Revenue:</span>
                <span className="font-semibold">
                  ${(calculateProjectedRevenue(scenario, 4) / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Comparison */}
      {scenarios.length > 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Scenario</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-900">Growth Rate</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-900">Year 2 Revenue</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-900">Year 5 Revenue</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-900">Margin</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario) => (
                  <tr key={scenario.id} className="border-b border-gray-100">
                    <td className="py-2 px-4 font-medium text-gray-900">{scenario.name}</td>
                    <td className="py-2 px-4 text-right">{scenario.revenueGrowth}%</td>
                    <td className="py-2 px-4 text-right">
                      ${(calculateProjectedRevenue(scenario, 1) / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-2 px-4 text-right">
                      ${(calculateProjectedRevenue(scenario, 4) / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-2 px-4 text-right">{calculateProjectedMargin(scenario).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scenarios;