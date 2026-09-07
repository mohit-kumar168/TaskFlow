import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import ReportPanel, { EmptyChart } from "./ReportPanel";

interface IssueStatusChartProps {
  data: { name: string; count: number }[];
}

const IssueStatusChart = ({ data }: IssueStatusChartProps) => (
  <ReportPanel title="Issue Status" description="Current distribution of issues by status.">
    {data.length === 0 ? <EmptyChart /> : (
      <div className="h-70">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(249, 115, 22, 0.06)" }} />
            <Bar dataKey="count" name="Issues" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={55} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </ReportPanel>
);

export default IssueStatusChart;