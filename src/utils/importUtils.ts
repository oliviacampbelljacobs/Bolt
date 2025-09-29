import { FinancialData, ScenarioData } from '../types/financial';

export interface ImportedData {
  financialData: FinancialData;
  scenarios: ScenarioData[];
  metadata?: {
    version: string;
    description: string;
    currency: string;
    exportDate?: string;
  };
}

export const importFromJSON = (file: File): Promise<ImportedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const data = JSON.parse(jsonString);
        
        // Validate the structure
        if (!data.financialData || !data.scenarios) {
          throw new Error('Invalid file format: Missing required data');
        }
        
        // Validate financial data structure
        const requiredFields = ['revenue', 'cogs', 'operatingExpenses', 'depreciation', 'interest', 'taxes', 'assets', 'liabilities', 'equity', 'cashFlow', 'years'];
        for (const field of requiredFields) {
          if (!data.financialData[field]) {
            throw new Error(`Invalid file format: Missing ${field} data`);
          }
        }
        
        resolve({
          financialData: data.financialData,
          scenarios: data.scenarios,
          metadata: data.metadata
        });
      } catch (error) {
        reject(new Error(`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateFinancialData = (data: any): data is FinancialData => {
  const requiredFields = ['revenue', 'cogs', 'operatingExpenses', 'depreciation', 'interest', 'taxes', 'assets', 'liabilities', 'equity', 'cashFlow', 'years'];
  
  return requiredFields.every(field => 
    Array.isArray(data[field]) && data[field].length > 0
  );
};

export const validateScenarios = (data: any): data is ScenarioData[] => {
  return Array.isArray(data) && data.every(scenario => 
    typeof scenario.id === 'string' &&
    typeof scenario.name === 'string' &&
    typeof scenario.revenueGrowth === 'number' &&
    typeof scenario.marginImprovement === 'number'
  );
};