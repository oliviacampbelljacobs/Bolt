import React from 'react';
import { FinancialData } from '../types/financial';
import FinancialTable from './FinancialTable';

interface BalanceSheetProps {
  financialData: FinancialData;
  setFinancialData: React.Dispatch<React.SetStateAction<FinancialData>>;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ 
  financialData, 
  setFinancialData 
}) => {
  const updateValue = (field: keyof FinancialData, yearIndex: number, value: number) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: prev[field].map((val, idx) => idx === yearIndex ? value : val)
    }));
  };

  const calculateTotalAssets = (yearIndex: number) => {
    return financialData.assets[yearIndex];
  };

  const calculateTotalLiabilitiesEquity = (yearIndex: number) => {
    return financialData.liabilities[yearIndex] + financialData.equity[yearIndex];
  };

  const rows = [
    {
      label: 'ASSETS',
      values: Array(financialData.years.length).fill(0),
      editable: false,
      className: 'font-bold text-blue-600 bg-blue-50'
    },
    {
      label: 'Total Assets',
      values: financialData.assets,
      editable: true,
      field: 'assets' as keyof FinancialData,
      className: 'font-semibold text-blue-600'
    },
    {
      label: '',
      values: Array(financialData.years.length).fill(0),
      editable: false,
      className: 'border-b-2 border-gray-300'
    },
    {
      label: 'LIABILITIES & EQUITY',
      values: Array(financialData.years.length).fill(0),
      editable: false,
      className: 'font-bold text-red-600 bg-red-50'
    },
    {
      label: 'Total Liabilities',
      values: financialData.liabilities,
      editable: true,
      field: 'liabilities' as keyof FinancialData,
      className: 'text-red-600'
    },
    {
      label: 'Total Equity',
      values: financialData.equity,
      editable: true,
      field: 'equity' as keyof FinancialData,
      className: 'text-green-600'
    },
    {
      label: 'Total Liabilities & Equity',
      values: financialData.years.map((_, index) => calculateTotalLiabilitiesEquity(index)),
      editable: false,
      className: 'font-bold text-gray-900 border-t-2 border-gray-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Balance Sheet</h2>
        <div className="text-sm text-gray-500">All figures in USD</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <FinancialTable
          years={financialData.years}
          rows={rows}
          onUpdateValue={updateValue}
        />
      </div>

      {/* Balance Check */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {financialData.years.map((year, index) => {
          const assets = calculateTotalAssets(index);
          const liabilitiesEquity = calculateTotalLiabilitiesEquity(index);
          const balanced = Math.abs(assets - liabilitiesEquity) < 0.01;
          
          return (
            <div key={year} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{year}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assets:</span>
                  <span className="font-semibold">${(assets / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Liab + Equity:</span>
                  <span className="font-semibold">${(liabilitiesEquity / 1000000).toFixed(1)}M</span>
                </div>
                <div className={`flex justify-between text-sm font-bold ${balanced ? 'text-green-600' : 'text-red-600'}`}>
                  <span>Balance:</span>
                  <span>{balanced ? '✓ Balanced' : '✗ Unbalanced'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Ratios */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet Ratios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {financialData.years.map((year, index) => {
            const debtToEquity = financialData.equity[index] > 0 
              ? financialData.liabilities[index] / financialData.equity[index] 
              : 0;
            
            return (
              <div key={year} className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {debtToEquity.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Debt-to-Equity ({year})</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;