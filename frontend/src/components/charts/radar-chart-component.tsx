import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartComponentProps {
  data: any[];
  title: string | React.ReactNode;
  height?: string | number;
  width?: string | number;
  dataKeys: {
    key: string;
    color: string;
    name: string;
  }[];
}

export function RadarChartComponent({
  data,
  title,
  height = '80',
  width = '100%',
  dataKeys,
}: RadarChartComponentProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div
        style={{
          height: typeof height === 'string' ? `${height}vh` : `${height}px`,
          width: typeof width === 'string' ? width : `${width}px`,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            {dataKeys.map(({ key, color, name }) => (
              <Radar
                name={name || key}
                dataKey={key}
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
