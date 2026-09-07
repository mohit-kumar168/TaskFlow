import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import ReportPanel, { EmptyChart } from "./ReportPanel";

interface IssuePriorityChartProps {
  data: { name: string; priority: string; count: number }[];
}

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};

const IssuePriorityChart = ({ data }: IssuePriorityChartProps) => (
  <ReportPanel title="Issue Priority" description="Distribution of issues by priority.">
    {data.length === 0 ? <EmptyChart /> : (
      <>
        <div className="h-70">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3}>
                {data.map((item) => <Cell key={item.priority} fill={PRIORITY_COLORS[item.priority] ?? "#94a3b8"} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {data.map((item) => (
            <div key={item.priority} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[item.priority] ?? "#94a3b8" }} />
              <span className="text-xs text-gray-500">{item.name}</span>
              <span className="text-xs font-medium text-gray-700">{item.count}</span>
            </div>
          ))}
        </div>
      </>
    )}
  </ReportPanel>
);

export default IssuePriorityChart;