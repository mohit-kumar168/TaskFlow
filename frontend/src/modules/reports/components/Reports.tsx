import { useEffect } from "react";

import { useReportStore } from "@/store/report.store";
import IssuePriorityChart from "./IssuePriorityChart";
import IssueStatusChart from "./IssueStatusChart";
import IssueTrendChart from "./IssueTrendChart";
import ReportSummaryCards from "./ReportSummaryCards";
import SprintProgressChart from "./SprintProgressChart";

interface ReportsProps {
  organizationSlug: string;
  workspaceSlug: string;
  projectSlug: string;
}

const Reports = ({ organizationSlug, workspaceSlug, projectSlug }: ReportsProps) => {
  const {
    issueStatusReport,
    issuePriorityReport,
    issueTrendReport,
    sprintProgressReport,
    isLoading,
    fetchReports,
  } = useReportStore();

  useEffect(() => {
    if (!organizationSlug || !workspaceSlug || !projectSlug) {
      return;
    }

    void fetchReports(organizationSlug, workspaceSlug, projectSlug);
  }, [organizationSlug, workspaceSlug, projectSlug, fetchReports]);

  const totalIssues = issueStatusReport.reduce((total, item) => total + item.count, 0);
  const completedIssues = issueStatusReport.find((item) => item.status === "DONE")?.count ?? 0;
  const activeIssues = totalIssues - completedIssues;
  const completionRate = totalIssues === 0 ? 0 : Math.round((completedIssues / totalIssues) * 100);

  const statusData = issueStatusReport.map((item) => ({
    name: formatLabel(item.status),
    count: item.count,
  }));
  const priorityData = issuePriorityReport.map((item) => ({
    name: formatLabel(item.priority),
    priority: item.priority,
    count: item.count,
  }));
  const sprintData = sprintProgressReport.map((sprint) => ({
    name: sprint.sprintName,
    progress: sprint.progress,
  }));

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div>
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-xl border border-gray-200 bg-white" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
        <p className="mt-1 text-sm text-gray-500">Overview of issues, priorities, trends, and sprint progress.</p>
      </div>

      <ReportSummaryCards
        totalIssues={totalIssues}
        activeIssues={activeIssues}
        completedIssues={completedIssues}
        completionRate={completionRate}
        sprintsTracked={sprintProgressReport.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IssueStatusChart data={statusData} />
        <IssuePriorityChart data={priorityData} />
        <IssueTrendChart data={issueTrendReport} />
        <SprintProgressChart data={sprintData} />
      </div>
    </section>
  );
};

const formatLabel = (value: string) => value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

export default Reports;
