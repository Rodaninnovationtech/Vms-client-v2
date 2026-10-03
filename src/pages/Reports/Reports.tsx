import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Card, PageHeader, Select, Button, Table, Badge } from "@/components/ui";
import type { TableColumn, BadgeVariant } from "@/types";

interface ReportRow {
  id: string;
  date: string;
  site: string;
  totalVisitors: number;
  totalContractors: number;
  pendingApprovals: number;
  status: string;
}

const statusVariant: Record<string, BadgeVariant> = { Generated: "success", Draft: "warning" };

const columns: TableColumn<ReportRow>[] = [
  { key: "date", header: "Date" },
  { key: "site", header: "Site" },
  { key: "totalVisitors", header: "Visitors" },
  { key: "totalContractors", header: "Contractors" },
  { key: "pendingApprovals", header: "Pending Approvals" },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
  },
];

const data: ReportRow[] = [
  { id: "1", date: "16-09-2026", site: "Tower A", totalVisitors: 112, totalContractors: 18, pendingApprovals: 2, status: "Generated" },
  { id: "2", date: "16-09-2026", site: "Tower B", totalVisitors: 84, totalContractors: 9, pendingApprovals: 0, status: "Generated" },
  { id: "3", date: "17-09-2026", site: "Tower C", totalVisitors: 63, totalContractors: 14, pendingApprovals: 4, status: "Draft" },
  { id: "4", date: "17-09-2026", site: "Tower D", totalVisitors: 40, totalContractors: 5, pendingApprovals: 1, status: "Draft" },
];

const reportTypes = [
  { label: "Visitor Summary", value: "visitor_summary" },
  { label: "Contractor Summary", value: "contractor_summary" },
  { label: "Approval Log", value: "approval_log" },
  { label: "Property Access Log", value: "property_access_log" },
];

const siteOptions = [
  { label: "All Sites", value: "all" },
  { label: "Tower A", value: "Tower A" },
  { label: "Tower B", value: "Tower B" },
  { label: "Tower C", value: "Tower C" },
  { label: "Tower D", value: "Tower D" },
];

const Reports = () => {
  const [reportType, setReportType] = useState("visitor_summary");
  const [site, setSite] = useState("all");

  return (
    <div>
      <PageHeader
        title="Report"
        description="Generate and export operational reports across sites."
        actions={
          <Button icon={<Download size={16} />} size="sm">
            Export CSV
          </Button>
        }
      />

      <Card className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Select
            label="Report Type"
            options={reportTypes}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          />
          <Select label="Site" options={siteOptions} value={site} onChange={(e) => setSite(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">From Date</label>
            <input
              type="date"
              className="rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">To Date</label>
            <input
              type="date"
              className="rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button icon={<FileText size={16} />}>Generate Report</Button>
        </div>
      </Card>

      <Card title="Generated Reports" subtitle="Recent report snapshots" noPadding>
        <div className="p-4 sm:p-5">
          <Table columns={columns} data={data} keyField="id" />
        </div>
      </Card>
    </div>
  );
};

export default Reports;
