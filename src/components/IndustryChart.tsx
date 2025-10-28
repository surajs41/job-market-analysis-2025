import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface IndustryChartProps {
  data: {
    industry: string;
    count: number;
    avgSalary: number;
  }[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(234 60% 70%)',
  'hsl(270 60% 75%)',
  'hsl(195 60% 70%)',
];

export const IndustryChart = ({ data }: IndustryChartProps) => {
  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Jobs by Industry</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ industry, percent }) => `${industry} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === 'count') return [`${value} jobs`, 'Jobs'];
              return value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
