import React from 'react';

interface ChartData {
  year: string;
  Revenue: number;
  EBITDA: number;
  'Net Income': number;
}

interface ChartProps {
  data: ChartData[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.Revenue, d.EBITDA, d['Net Income']]));
  const chartHeight = 200;

  return (
    <div className="relative">
      <div className="flex items-end space-x-4 h-48">
        {data.map((item, index) => (
          <div key={item.year} className="flex-1 flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center space-y-1 w-full">
              {/* Revenue Bar */}
              <div
                className="w-4 bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${(item.Revenue / maxValue) * chartHeight}px` }}
                title={`Revenue: $${item.Revenue.toFixed(1)}M`}
              />
              {/* EBITDA Bar */}
              <div
                className="w-4 bg-purple-500 rounded opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${(item.EBITDA / maxValue) * chartHeight * 0.8}px` }}
                title={`EBITDA: $${item.EBITDA.toFixed(1)}M`}
              />
              {/* Net Income Bar */}
              <div
                className="w-4 bg-green-500 rounded-b opacity-60 hover:opacity-100 transition-opacity"
                style={{ height: `${(item['Net Income'] / maxValue) * chartHeight * 0.6}px` }}
                title={`Net Income: $${item['Net Income'].toFixed(1)}M`}
              />
            </div>
            <div className="text-xs text-gray-600 font-medium">{item.year}</div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4 space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">EBITDA</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Net Income</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;