import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { JobData } from "@/lib/dataParser";

interface RemoteDistributionProps {
  data: JobData[];
}

const COLORS = {
  remote: 'hsl(var(--chart-1))',
  hybrid: 'hsl(var(--chart-2))',
  onsite: 'hsl(var(--chart-3))',
};

export const RemoteDistribution = ({ data }: RemoteDistributionProps) => {
  const distribution = data.reduce((acc, job) => {
    if (job.remote_ratio === 100) acc.remote++;
    else if (job.remote_ratio === 0) acc.onsite++;
    else acc.hybrid++;
    return acc;
  }, { remote: 0, hybrid: 0, onsite: 0 });

  const chartData = [
    { name: 'Fully Remote', value: distribution.remote, color: COLORS.remote },
    { name: 'Hybrid', value: distribution.hybrid, color: COLORS.hybrid },
    { name: 'On-site', value: distribution.onsite, color: COLORS.onsite },
  ].filter(d => d.value > 0);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold mb-4">Work Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
