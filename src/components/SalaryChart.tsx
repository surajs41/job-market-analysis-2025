import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SalaryChartProps {
  data: {
    level: string;
    avgSalary: number;
    minSalary: number;
    maxSalary: number;
  }[];
}

export const SalaryChart = ({ data }: SalaryChartProps) => {
  return (
    <div className="chart-container overflow-hidden">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Salary by Experience Level</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="level" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="avgSalary" fill="hsl(var(--chart-1))" name="Average Salary" radius={[8, 8, 0, 0]} />
          <Bar dataKey="maxSalary" fill="hsl(var(--chart-2))" name="Max Salary" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
