import React from 'react';
import { Code, Database, Share2, GitBranch, FileText, Zap } from 'lucide-react';

const JsonUsageGuide: React.FC = () => {
  const useCases = [
    {
      icon: Database,
      title: "Data Backup & Restore",
      description: "Save your financial models as JSON files for backup. Import them later to restore your work exactly as it was.",
      example: "Export before major changes, keep versions of different scenarios"
    },
    {
      icon: Share2,
      title: "Team Collaboration",
      description: "Share JSON files with team members who can import them into their own instances of the application.",
      example: "Email the JSON file or store it in shared cloud storage"
    },
    {
      icon: Code,
      title: "Programming & Analysis",
      description: "Use JSON data in Python, R, JavaScript, or other programming languages for advanced analysis.",
      example: "Load into pandas DataFrame, create custom visualizations, run Monte Carlo simulations"
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Track changes to your financial models over time by storing JSON files in version control systems.",
      example: "Commit JSON files to Git, compare different model versions"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "JSON files contain metadata about when they were created and what assumptions were used.",
      example: "Include export date, model version, and description in the file"
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "Use JSON format to integrate with other financial systems, databases, or web services.",
      example: "POST data to APIs, import into databases, connect to BI tools"
    }
  ];

  const codeExample = `// Example: Loading JSON data in Python
import json
import pandas as pd

# Load the JSON file
with open('Financial_Model_2024-01-15.json', 'r') as f:
    data = json.load(f)

# Convert to pandas DataFrame
revenue_df = pd.DataFrame({
    'Year': data['financialData']['years'],
    'Revenue': data['financialData']['revenue']
})

# Analyze the data
print(revenue_df.describe())
print(f"Average annual growth: {revenue_df['Revenue'].pct_change().mean():.2%}")`;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Use JSON Files</h1>
        <p className="text-lg text-gray-600">
          JSON files from your financial model can be used in many powerful ways
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {useCases.map((useCase, index) => {
          const Icon = useCase.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                  <p className="text-gray-600 mb-3">{useCase.description}</p>
                  <p className="text-sm text-blue-600 font-medium">{useCase.example}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Code Example: Python Analysis</h3>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          <code>{codeExample}</code>
        </pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">JSON File Structure</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>financialData:</strong> All your financial statement data (revenue, expenses, assets, etc.)</p>
          <p><strong>scenarios:</strong> Your scenario analysis data with growth rates and assumptions</p>
          <p><strong>metadata:</strong> Export information including date, version, and description</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600">
          JSON files are human-readable, lightweight, and compatible with virtually every programming language and data analysis tool.
        </p>
      </div>
    </div>
  );
};

export default JsonUsageGuide;