import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Percent } from 'lucide-react';
import { FinancialData, ScenarioData } from '../types/financial';
import MetricCard from './MetricCard';
import Chart from './Chart';

interface DashboardProps {
  financialData: FinancialData;
  scenarios: ScenarioData[];
}

const Dashboard: React.FC<DashboardProps> = ({ financialData, scenarios }) => {
  const currentYear = new Date().getFullYear();
  const currentYearIndex = financialData.years.findIndex(year => year === currentYear);
  const validIndex = currentYearIndex >= 0 ? currentYearIndex : 0;

  const calculateGrowthRate = (values: number[], index: number) => {
    if (index === 0 || values[index - 1] === 0) return 0;
    return ((values[index] - values[index - 1]) / values[index - 1]) * 100;
  };

  const calculateMargin = (revenue: number, cost: number) => {
    if (revenue === 0) return 0;
    return ((revenue - cost) / revenue) * 100;
  };

  const calculateEBITDA = (index: number) => {
    const grossProfit = financialData.revenue[index] - financialData.cogs[index];
    return grossProfit - financialData.operatingExpenses[index];
  };

  const revenueGrowth = calculateGrowthRate(financialData.revenue, validIndex + 1);
  const grossMargin = calculateMargin(
    financialData.revenue[validIndex],
    financialData.cogs[validIndex]
  );
  const ebitda = calculateEBITDA(validIndex);
  const netIncome = ebitda - 
    financialData.depreciation[validIndex] - 
    financialData.interest[validIndex] - 
    financialData.taxes[validIndex];

  const chartData = financialData.years.map((year, index) => ({
    year: year.toString(),
    Revenue: financialData.revenue[index] / 1000000,
    EBITDA: calculateEBITDA(index) / 1000000,
    'Net Income': (calculateEBITDA(index) - financialData.depreciation[index] - financialData.interest[index] - financialData.taxes[index]) / 1000000
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={financialData.revenue[validIndex]}
          format="currency"
          trend={revenueGrowth}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="EBITDA"
          value={ebitda}
          format="currency"
          trend={ebitda > 0 ? 8 : -8}
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Net Income"
          value={netIncome}
          format="currency"
          trend={netIncome > 0 ? 5 : -5}
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Cash Flow"
          value={financialData.cashFlow[validIndex]}
          format="currency"
          trend={8}
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
          <Chart data={chartData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                  <p className="text-sm text-gray-500">
                    {scenario.revenueGrowth}% revenue growth
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ${(financialData.revenue[validIndex] * (1 + scenario.revenueGrowth / 100) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-gray-500">Projected Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {(financialData.assets[validIndex] / financialData.liabilities[validIndex] || 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Asset to Liability Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {grossMargin.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Gross Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {financialData.revenue[validIndex] > 0 ? ((ebitda / financialData.revenue[validIndex]) * 100).toFixed(1) : '0.0'}%
            </div>
            <div className="text-sm text-gray-500">EBITDA Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {((netIncome / financialData.revenue[validIndex]) * 100 || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Net Margin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;