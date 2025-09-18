import React from 'react';
import { FinancialData } from '../types/financial';
import FinancialTable from './FinancialTable';

interface CashFlowStatementProps {
  financialData: FinancialData;
  setFinancialData: React.Dispatch<React.SetStateAction<FinancialData>>;
}

const CashFlowStatement: React.FC<CashFlowStatementProps> = ({ 
  financialData, 
  setFinancialData 
}) => {
  const updateValue = (field: keyof FinancialData, yearIndex: number, value: number) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: prev[field].map((val, idx) => idx === yearIndex ? value : val)
    }));
  };

  const calculateNetIncome = (yearIndex: number) => {
    const grossProfit = financialData.revenue[yearIndex] - financialData.cogs[yearIndex];
    const ebitda = grossProfit - financialData.operatingExpenses[yearIndex];
    const ebit = ebitda - financialData.depreciation[yearIndex];
    return ebit - financialData.interest[yearIndex] - financialData.taxes[yearIndex];
  };

  const rows = [
    {
      label: 'OPERATING ACTIVITIES',
      values: Array(financialData.years.length).fill(0),
      editable: false,
      className: 'font-bold text-blue-600 bg-blue-50'
    },
    {
      label: 'Net Income',
      values: financialData.years.map((_, index) => calculateNetIncome(index)),
      editable: false,
      className: 'font-semibold text-green-600'
    },
    {
      label: 'Net Cash Flow from Operations',
      values: financialData.cashFlow,
      editable: true,
      field: 'cashFlow' as keyof FinancialData,
      className: 'font-semibold text-blue-600 border-t border-gray-300'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cash Flow Statement</h2>
        <div className="text-sm text-gray-500">All figures in USD</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <FinancialTable
          years={financialData.years}
          rows={rows}
          onUpdateValue={updateValue}
        />
      </div>

      {/* Cash Flow Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {financialData.years.map((year, index) => {
          const netIncome = calculateNetIncome(index);
          const cashFlow = financialData.cashFlow[index];
          const cashConversion = netIncome > 0 ? (cashFlow / netIncome) * 100 : 0;
          
          return (
            <div key={year} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{year}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Net Income:</span>
                  <span className="font-semibold">${(netIncome / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cash Flow:</span>
                  <span className="font-semibold">${(cashFlow / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversion:</span>
                  <span className={`font-semibold ${cashConversion > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {cashConversion.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cash Flow Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Trends</h3>
        <div className="space-y-4">
          {financialData.years.map((year, index) => {
            const cashFlow = financialData.cashFlow[index];
            const maxCashFlow = Math.max(...financialData.cashFlow);
            const percentage = maxCashFlow > 0 ? (cashFlow / maxCashFlow) * 100 : 0;
            
            return (
              <div key={year} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">{year}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full transition-all duration-500 ${
                      cashFlow >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.abs(percentage)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    ${(cashFlow / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CashFlowStatement;