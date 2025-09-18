import React from 'react';
import { FinancialData } from '../types/financial';
import FinancialTable from './FinancialTable';

interface IncomeStatementProps {
  financialData: FinancialData;
  setFinancialData: React.Dispatch<React.SetStateAction<FinancialData>>;
}

const IncomeStatement: React.FC<IncomeStatementProps> = ({ 
  financialData, 
  setFinancialData 
}) => {
  const updateValue = (field: keyof FinancialData, yearIndex: number, value: number) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: prev[field].map((val, idx) => idx === yearIndex ? value : val)
    }));
  };

  const calculateGrossProfit = (yearIndex: number) => {
    return financialData.revenue[yearIndex] - financialData.cogs[yearIndex];
  };

  const calculateNetIncome = (yearIndex: number) => {
    const ebit = calculateEBIT(yearIndex);
    return ebit - financialData.interest[yearIndex] - financialData.taxes[yearIndex];
  };

  const calculateEBITDA = (yearIndex: number) => {
    const grossProfit = calculateGrossProfit(yearIndex);
    return grossProfit - financialData.operatingExpenses[yearIndex];
  };

  const calculateEBIT = (yearIndex: number) => {
    const ebitda = calculateEBITDA(yearIndex);
    return ebitda - financialData.depreciation[yearIndex];
  };

  const rows = [
    {
      label: 'Revenue',
      values: financialData.revenue,
      editable: true,
      field: 'revenue' as keyof FinancialData,
      className: 'font-semibold text-blue-600'
    },
    {
      label: 'Cost of Goods Sold',
      values: financialData.cogs,
      editable: true,
      field: 'cogs' as keyof FinancialData,
      className: 'text-red-600'
    },
    {
      label: 'Gross Profit',
      values: financialData.years.map((_, index) => calculateGrossProfit(index)),
      editable: false,
      className: 'font-semibold text-green-600 border-t border-gray-300'
    },
    {
      label: 'Operating Expenses',
      values: financialData.operatingExpenses,
      editable: true,
      field: 'operatingExpenses' as keyof FinancialData,
      className: 'text-red-600'
    },
    {
      label: 'EBITDA',
      values: financialData.years.map((_, index) => calculateEBITDA(index)),
      editable: false,
      className: 'font-semibold text-purple-600 border-t border-gray-300'
    },
    {
      label: 'Depreciation & Amortization',
      values: financialData.depreciation,
      editable: true,
      field: 'depreciation' as keyof FinancialData,
      className: 'text-red-600'
    },
    {
      label: 'EBIT',
      values: financialData.years.map((_, index) => calculateEBIT(index)),
      editable: false,
      className: 'font-semibold text-indigo-600'
    },
    {
      label: 'Interest Expense',
      values: financialData.interest,
      editable: true,
      field: 'interest' as keyof FinancialData,
      className: 'text-red-600'
    },
    {
      label: 'Taxes',
      values: financialData.taxes,
      editable: true,
      field: 'taxes' as keyof FinancialData,
      className: 'text-red-600'
    },
    {
      label: 'Net Income',
      values: financialData.years.map((_, index) => calculateNetIncome(index)),
      editable: false,
      className: 'font-bold text-green-700 border-t-2 border-gray-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Income Statement</h2>
        <div className="text-sm text-gray-500">All figures in USD</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <FinancialTable
          years={financialData.years}
          rows={rows}
          onUpdateValue={updateValue}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financialData.years.map((year, index) => (
          <div key={year} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{year} Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Margin:</span>
                <span className="font-semibold">
                  {financialData.revenue[index] > 0 
                    ? ((calculateGrossProfit(index) / financialData.revenue[index]) * 100).toFixed(1)
                    : '0.0'
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EBITDA Margin:</span>
                <span className="font-semibold text-purple-600">
                  {financialData.revenue[index] > 0 
                    ? ((calculateEBITDA(index) / financialData.revenue[index]) * 100).toFixed(1)
                    : '0.0'
                  }%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Net Margin:</span>
                <span className="font-semibold">
                  {financialData.revenue[index] > 0 
                    ? ((calculateNetIncome(index) / financialData.revenue[index]) * 100).toFixed(1)
                    : '0.0'
                  }%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeStatement;