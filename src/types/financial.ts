export interface FinancialData {
  revenue: number[];
  cogs: number[];
  operatingExpenses: number[];
  depreciation: number[];
  interest: number[];
  taxes: number[];
  assets: number[];
  liabilities: number[];
  equity: number[];
  cashFlow: number[];
  years: number[];
}

export interface ScenarioData {
  id: string;
  name: string;
  revenueGrowth: number;
  marginImprovement: number;
}

export interface MetricData {
  name: string;
  values: number[];
  format: 'currency' | 'percentage' | 'number';
}