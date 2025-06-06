import {
  AreaChart, Area,
  XAxis as XAxisType, YAxis as YAxisType,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const XAxis = XAxisType as any;
const YAxis = YAxisType as any;

interface AreaChartComponentProps {
  data: any[];
  title: string | React.ReactNode;
  height?: string | number;
  width?: string | number;
  xAxisDataKey?: string;
  dataKey: string;
  name: string;
  color: string;
}

export function AreaChartComponent({
  data,
  title,
  height = '80',
  width = '100%',
  xAxisDataKey = 'month',
  dataKey,
  name,
  color
}: AreaChartComponentProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div style={{ 
        height: typeof height === 'string' ? `${height}vh` : `${height}px`,
        width: typeof width === 'string' ? width : `${width}px`
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={color} 
              name={name} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
