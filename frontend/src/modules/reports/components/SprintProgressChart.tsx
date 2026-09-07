import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import ReportPanel, { EmptyChart } from "./ReportPanel";

interface SprintProgressChartProps {
  data: { name: string; progress: number }[];
}

const SprintProgressChart = ({ data }: SprintProgressChartProps) => (
  <ReportPanel title="Sprint Progress" description="Completion progress across project sprints." className="lg:col-span-2">
    {data.length === 0 ? <EmptyChart /> : (
      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
            <Bar dataKey="progress" name="Progress" fill="#f97316" radius={[0, 6, 6, 0]} maxBarSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </ReportPanel>
);

export default SprintProgressChart;