import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, Database } from 'lucide-react';
import { FinancialData, ScenarioData } from '../types/financial';
import { exportToExcel, exportToJSON, exportToCSV } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  financialData: FinancialData;
  scenarios: ScenarioData[];
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  financialData,
  scenarios
}) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: 'excel' | 'json' | 'csv') => {
    setIsExporting(true);
    
    try {
      switch (format) {
        case 'excel':
          exportToExcel(financialData, scenarios);
          break;
        case 'json':
          exportToJSON(financialData, scenarios);
          break;
        case 'csv':
          exportToCSV(financialData);
          break;
      }
      
      // Close modal after successful export
      setTimeout(() => {
        onClose();
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Export Financial Model</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm mb-6">
            Choose your preferred export format. All data including financial statements, scenarios, and key metrics will be included.
          </p>

          {/* Excel Export */}
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
              <FileSpreadsheet className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">Excel Spreadsheet</h3>
              <p className="text-sm text-gray-600">
                Complete model with separate sheets for each statement
              </p>
            </div>
            <Download className="h-5 w-5 text-gray-400" />
          </button>

          {/* CSV Export */}
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">CSV File</h3>
              <p className="text-sm text-gray-600">
                Simple format compatible with any spreadsheet software
              </p>
            </div>
            <Download className="h-5 w-5 text-gray-400" />
          </button>

          {/* JSON Export */}
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">JSON Data</h3>
              <p className="text-sm text-gray-600">
                Raw data format for developers and data analysis
              </p>
            </div>
            <Download className="h-5 w-5 text-gray-400" />
          </button>

          {isExporting && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">Preparing download...</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500">
            Files will be saved with today's date. Excel format includes all sheets and calculations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;