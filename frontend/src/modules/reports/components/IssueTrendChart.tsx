import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import ReportPanel, { EmptyChart } from "./ReportPanel";

interface IssueTrendChartProps {
  data: { date: string; count: number }[];
}

const formatDate = (date: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return date;
  }

  const parsedDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const IssueTrendChart = ({ data }: IssueTrendChartProps) => (
  <ReportPanel title="Issue Trend" description="Number of issues created over time." className="lg:col-span-2">
    {data.length === 0 ? <EmptyChart /> : (
      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatDate} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip labelFormatter={(value) => formatDate(String(value))} />
            <Line type="monotone" dataKey="count" name="Issues" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: "#f97316", strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </ReportPanel>
);

export default IssueTrendChart;