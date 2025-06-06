import {
  PieChart, Pie, Cell,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface PieChartComponentProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  title: string | React.ReactNode;
  height?: string | number;
  width?: string | number;
  dataKey?: string;
  showPercentage?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export function PieChartComponent({
  data,
  title,
  height = '80',
  width = '100%',
  dataKey = 'value',
  showPercentage = true,
  innerRadius = 0,
  outerRadius = 80
}: PieChartComponentProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div style={{ 
        height: typeof height === 'string' ? `${height}vh` : `${height}px`,
        width: typeof width === 'string' ? width : `${width}px`
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={showPercentage}
              label={showPercentage ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
