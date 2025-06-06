import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button';
import { 
  LineChartComponent, 
  BarChartComponent,
  PieChartComponent,
  AreaChartComponent,
  RadarChartComponent
} from '../components/charts';

export function Charts() {
  const { t } = useTranslation();
  const [activeChart, setActiveChart] = useState<string>('line');

  // sample data for line and bar charts
  const salesData = [
    { month: 'Jan', revenue: 4000, profit: 2400, customers: 500 },
    { month: 'Feb', revenue: 3000, profit: 1398, customers: 450 },
    { month: 'Mar', revenue: 2000, profit: 9800, customers: 620 },
    { month: 'Apr', revenue: 2780, profit: 3908, customers: 580 },
    { month: 'May', revenue: 1890, profit: 4800, customers: 610 },
    { month: 'Jun', revenue: 2390, profit: 3800, customers: 510 },
    { month: 'Jul', revenue: 3490, profit: 4300, customers: 530 },
    { month: 'Aug', revenue: 4000, profit: 2400, customers: 590 },
    { month: 'Sep', revenue: 2500, profit: 1398, customers: 480 },
    { month: 'Oct', revenue: 2300, profit: 2800, customers: 570 },
    { month: 'Nov', revenue: 3100, profit: 2300, customers: 610 },
    { month: 'Dec', revenue: 5000, profit: 3500, customers: 700 },
  ];

  // sample data for pie chart
  const categoryData = [
    { name: 'Electronics', value: 400, fill: '#0088FE' },
    { name: 'Clothing', value: 300, fill: '#00C49F' },
    { name: 'Books', value: 300, fill: '#FFBB28' },
    { name: 'Home', value: 200, fill: '#FF8042' },
    { name: 'Sports', value: 150, fill: '#8884d8' },
  ];

  // sample data for radar chart
  const radarData = [
    {
      subject: 'Math',
      A: 120,
      B: 110,
      fullMark: 150,
    },
    {
      subject: 'Chinese',
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      subject: 'English',
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      subject: 'Geography',
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      subject: 'Physics',
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      subject: 'History',
      A: 65,
      B: 85,
      fullMark: 150,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('sampleCharts')}</h1>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            label={t('lineChart')}
            onClick={() => setActiveChart('line')}
            className={activeChart === 'line' ? 'bg-blue-500 text-white' : ''}
          />
          <Button 
            label={t('barChart')}
            onClick={() => setActiveChart('bar')}
            className={activeChart === 'bar' ? 'bg-blue-500 text-white' : ''}
          />
          <Button 
            label={t('pieChart')}
            onClick={() => setActiveChart('pie')}
            className={activeChart === 'pie' ? 'bg-blue-500 text-white' : ''}
          />
          <Button 
            label={t('areaChart')}
            onClick={() => setActiveChart('area')}
            className={activeChart === 'area' ? 'bg-blue-500 text-white' : ''}
          />
          <Button 
            label={t('radarChart')}
            onClick={() => setActiveChart('radar')}
            className={activeChart === 'radar' ? 'bg-blue-500 text-white' : ''}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          {activeChart === 'line' && (
            <LineChartComponent 
              data={salesData} 
              title={t('monthlySales')}
              height="80"
              width="100%"
              dataKeys={[
                { key: 'revenue', color: '#8884d8', name: t('revenue', 'Revenue'), activeDot: true },
                { key: 'profit', color: '#82ca9d', name: t('profit', 'Profit') }
              ]}
            />
          )}

          {activeChart === 'bar' && (
            <BarChartComponent 
              data={salesData} 
              title={t('salesComparison')}
              height="80"
              width="100%"
              dataKeys={[
                { key: 'revenue', color: '#8884d8', name: t('revenue', 'Revenue') },
                { key: 'profit', color: '#82ca9d', name: t('profit', 'Profit') }
              ]}
            />
          )}

          {activeChart === 'pie' && (
            <PieChartComponent 
              data={categoryData.map(item => ({ 
                ...item, 
                name: item.name 
              }))} 
              title={t('salesByCategory')}
              height="80"
              width="100%"
            />
          )}

          {activeChart === 'area' && (
            <AreaChartComponent 
              data={salesData} 
              title={t('customerTrend', 'Customer Trend')}
              height="80"
              width="100%"
              dataKey="customers"
              name={t('customers', 'Customers')}
              color="#8884d8"
            />
          )}

          {activeChart === 'radar' && (
            <RadarChartComponent 
              data={radarData} 
              title={t('studentPerformance')}
              height="80"
              width="100%"
              dataKeys={[
                { key: 'A', color: '#8884d8', name: t('studentA', 'Student A') },
                { key: 'B', color: '#82ca9d', name: t('studentB', 'Student B') }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
