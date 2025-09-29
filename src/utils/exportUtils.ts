import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FinancialData, ScenarioData } from '../types/financial';

export const exportToExcel = (financialData: FinancialData, scenarios: ScenarioData[]) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Helper function to calculate derived values
  const calculateGrossProfit = (yearIndex: number) => {
    return financialData.revenue[yearIndex] - financialData.cogs[yearIndex];
  };

  const calculateEBITDA = (yearIndex: number) => {
    const grossProfit = calculateGrossProfit(yearIndex);
    return grossProfit - financialData.operatingExpenses[yearIndex];
  };

  const calculateEBIT = (yearIndex: number) => {
    const ebitda = calculateEBITDA(yearIndex);
    return ebitda - financialData.depreciation[yearIndex];
  };

  const calculateNetIncome = (yearIndex: number) => {
    const ebit = calculateEBIT(yearIndex);
    return ebit - financialData.interest[yearIndex] - financialData.taxes[yearIndex];
  };

  // Income Statement Sheet
  const incomeStatementData = [
    ['Income Statement', '', ...financialData.years],
    ['', '', ...Array(financialData.years.length).fill('')],
    ['Revenue', '', ...financialData.revenue],
    ['Cost of Goods Sold', '', ...financialData.cogs],
    ['Gross Profit', '', ...financialData.years.map((_, index) => calculateGrossProfit(index))],
    ['Operating Expenses', '', ...financialData.operatingExpenses],
    ['EBITDA', '', ...financialData.years.map((_, index) => calculateEBITDA(index))],
    ['Depreciation & Amortization', '', ...financialData.depreciation],
    ['EBIT', '', ...financialData.years.map((_, index) => calculateEBIT(index))],
    ['Interest Expense', '', ...financialData.interest],
    ['Taxes', '', ...financialData.taxes],
    ['Net Income', '', ...financialData.years.map((_, index) => calculateNetIncome(index))],
  ];

  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeStatementData);
  XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income Statement');

  // Balance Sheet Sheet
  const balanceSheetData = [
    ['Balance Sheet', '', ...financialData.years],
    ['', '', ...Array(financialData.years.length).fill('')],
    ['ASSETS', '', ...Array(financialData.years.length).fill('')],
    ['Total Assets', '', ...financialData.assets],
    ['', '', ...Array(financialData.years.length).fill('')],
    ['LIABILITIES & EQUITY', '', ...Array(financialData.years.length).fill('')],
    ['Total Liabilities', '', ...financialData.liabilities],
    ['Total Equity', '', ...financialData.equity],
    ['Total Liabilities & Equity', '', ...financialData.years.map((_, index) => 
      financialData.liabilities[index] + financialData.equity[index]
    )],
  ];

  const balanceSheet = XLSX.utils.aoa_to_sheet(balanceSheetData);
  XLSX.utils.book_append_sheet(workbook, balanceSheet, 'Balance Sheet');

  // Cash Flow Sheet
  const cashFlowData = [
    ['Cash Flow Statement', '', ...financialData.years],
    ['', '', ...Array(financialData.years.length).fill('')],
    ['OPERATING ACTIVITIES', '', ...Array(financialData.years.length).fill('')],
    ['Net Income', '', ...financialData.years.map((_, index) => calculateNetIncome(index))],
    ['Net Cash Flow from Operations', '', ...financialData.cashFlow],
  ];

  const cashFlowSheet = XLSX.utils.aoa_to_sheet(cashFlowData);
  XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Cash Flow');

  // Scenarios Sheet
  const scenarioData = [
    ['Scenario Analysis', '', '', ''],
    ['', '', '', ''],
    ['Scenario Name', 'Revenue Growth (%)', 'Margin Improvement (%)', 'Projected Year 2 Revenue'],
    ...scenarios.map(scenario => {
      const baseRevenue = financialData.revenue[0] || 1000000;
      const projectedRevenue = baseRevenue * Math.pow(1 + scenario.revenueGrowth / 100, 2);
      return [scenario.name, scenario.revenueGrowth, scenario.marginImprovement, projectedRevenue];
    })
  ];

  const scenarioSheet = XLSX.utils.aoa_to_sheet(scenarioData);
  XLSX.utils.book_append_sheet(workbook, scenarioSheet, 'Scenarios');

  // Key Metrics Sheet
  const metricsData = [
    ['Key Financial Metrics', '', ...financialData.years],
    ['', '', ...Array(financialData.years.length).fill('')],
    ['Gross Margin (%)', '', ...financialData.years.map((_, index) => {
      const revenue = financialData.revenue[index];
      return revenue > 0 ? ((calculateGrossProfit(index) / revenue) * 100) : 0;
    })],
    ['EBITDA Margin (%)', '', ...financialData.years.map((_, index) => {
      const revenue = financialData.revenue[index];
      return revenue > 0 ? ((calculateEBITDA(index) / revenue) * 100) : 0;
    })],
    ['Net Margin (%)', '', ...financialData.years.map((_, index) => {
      const revenue = financialData.revenue[index];
      return revenue > 0 ? ((calculateNetIncome(index) / revenue) * 100) : 0;
    })],
    ['Debt-to-Equity Ratio', '', ...financialData.years.map((_, index) => {
      const equity = financialData.equity[index];
      return equity > 0 ? (financialData.liabilities[index] / equity) : 0;
    })],
  ];

  const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Key Metrics');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const fileName = `Financial_Model_${new Date().toISOString().split('T')[0]}.xlsx`;
  saveAs(data, fileName);
};

export const exportToJSON = (financialData: FinancialData, scenarios: ScenarioData[]) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    financialData,
    scenarios,
    metadata: {
      version: '1.0',
      description: 'Financial Model Export',
      currency: 'USD'
    }
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const fileName = `Financial_Model_${new Date().toISOString().split('T')[0]}.json`;
  saveAs(blob, fileName);
};

export const exportToCSV = (financialData: FinancialData) => {
  // Helper functions
  const calculateGrossProfit = (yearIndex: number) => {
    return financialData.revenue[yearIndex] - financialData.cogs[yearIndex];
  };

  const calculateEBITDA = (yearIndex: number) => {
    const grossProfit = calculateGrossProfit(yearIndex);
    return grossProfit - financialData.operatingExpenses[yearIndex];
  };

  const calculateEBIT = (yearIndex: number) => {
    const ebitda = calculateEBITDA(yearIndex);
    return ebitda - financialData.depreciation[yearIndex];
  };

  const calculateNetIncome = (yearIndex: number) => {
    const ebit = calculateEBIT(yearIndex);
    return ebit - financialData.interest[yearIndex] - financialData.taxes[yearIndex];
  };

  // Create CSV data
  const csvData = [
    ['Account', ...financialData.years],
    ['Revenue', ...financialData.revenue],
    ['Cost of Goods Sold', ...financialData.cogs],
    ['Gross Profit', ...financialData.years.map((_, index) => calculateGrossProfit(index))],
    ['Operating Expenses', ...financialData.operatingExpenses],
    ['EBITDA', ...financialData.years.map((_, index) => calculateEBITDA(index))],
    ['Depreciation & Amortization', ...financialData.depreciation],
    ['EBIT', ...financialData.years.map((_, index) => calculateEBIT(index))],
    ['Interest Expense', ...financialData.interest],
    ['Taxes', ...financialData.taxes],
    ['Net Income', ...financialData.years.map((_, index) => calculateNetIncome(index))],
    ['', ...Array(financialData.years.length).fill('')],
    ['Assets', ...financialData.assets],
    ['Liabilities', ...financialData.liabilities],
    ['Equity', ...financialData.equity],
    ['Cash Flow', ...financialData.cashFlow],
  ];

  const csvContent = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const fileName = `Financial_Model_${new Date().toISOString().split('T')[0]}.csv`;
  saveAs(blob, fileName);
};