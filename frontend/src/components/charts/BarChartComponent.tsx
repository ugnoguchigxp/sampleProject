import {
  BarChart, Bar,
  XAxis as XAxisType, YAxis as YAxisType,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const XAxis = XAxisType as any;
const YAxis = YAxisType as any;

interface BarChartComponentProps {
  data: any[];
  title: string | React.ReactNode;
  height?: string | number;
  width?: string | number;
  xAxisDataKey?: string;
  dataKeys: {
    key: string;
    color: string;
    name: string; // 已翻译的名称
  }[];
}

export function BarChartComponent({
  data,
  title,
  height = '80',
  width = '100%',
  xAxisDataKey = 'month',
  dataKeys
}: BarChartComponentProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div style={{ 
        height: typeof height === 'string' ? `${height}vh` : `${height}px`,
        width: typeof width === 'string' ? width : `${width}px`
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map(({ key, color, name }) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={color} 
                name={name} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
