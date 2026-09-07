import type { ReactNode } from "react";

interface ReportPanelProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

const ReportPanel = ({
  title,
  description,
  children,
  className = "",
}: ReportPanelProps) => {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
};

export const EmptyChart = () => (
  <div className="flex h-65 items-center justify-center">
    <p className="text-sm text-gray-400">No data available.</p>
  </div>
);

export default ReportPanel;