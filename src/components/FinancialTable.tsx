import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { FinancialData } from '../types/financial';

interface TableRow {
  label: string;
  values: number[];
  editable: boolean;
  field?: keyof FinancialData;
  className?: string;
}

interface FinancialTableProps {
  years: number[];
  rows: TableRow[];
  onUpdateValue: (field: keyof FinancialData, yearIndex: number, value: number) => void;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ 
  years, 
  rows, 
  onUpdateValue 
}) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const startEditing = (rowIndex: number, colIndex: number, currentValue: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(currentValue.toString());
  };

  const saveEdit = (rowIndex: number, colIndex: number) => {
    const row = rows[rowIndex];
    if (row.field) {
      const numValue = parseFloat(editValue) || 0;
      onUpdateValue(row.field, colIndex, numValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-6 font-semibold text-gray-900 w-1/4">Account</th>
            {years.map(year => (
              <th key={year} className="text-right py-3 px-6 font-semibold text-gray-900">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.label} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className={`py-4 px-6 font-medium ${row.className || 'text-gray-900'}`}>
                {row.label}
              </td>
              {row.values.map((value, colIndex) => (
                <td key={colIndex} className={`py-4 px-6 text-right ${row.className || 'text-gray-900'}`}>
                  {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                    <div className="flex items-center justify-end space-x-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit(rowIndex, colIndex);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(rowIndex, colIndex)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end space-x-2 group">
                      <span>{formatCurrency(value)}</span>
                      {row.editable && (
                        <button
                          onClick={() => startEditing(rowIndex, colIndex, value)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialTable;