import { Activity, BarChart3, CheckCircle2, ListTodo } from "lucide-react";

interface ReportSummaryCardsProps {
  totalIssues: number;
  activeIssues: number;
  completedIssues: number;
  completionRate: number;
  sprintsTracked: number;
}

const ReportSummaryCards = ({
  totalIssues,
  activeIssues,
  completedIssues,
  completionRate,
  sprintsTracked,
}: ReportSummaryCardsProps) => {
  const cards = [
    {
      label: "Total",
      value: totalIssues,
      detail: "All active project issues",
      icon: ListTodo,
      color: "bg-orange-50 text-orange-500",
    },
    {
      label: "Active",
      value: activeIssues,
      detail: "Issues not completed",
      icon: Activity,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed",
      value: completedIssues,
      detail: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Sprints",
      value: sprintsTracked,
      detail: "Sprints tracked",
      icon: BarChart3,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, detail, icon: Icon, color }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <span className="text-xs font-medium text-gray-400">{label}</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{detail}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportSummaryCards;