import { Users, ClipboardCheck, Clock, Building2, ArrowUpRight } from "lucide-react";
import { Card, PageHeader, Table, Badge } from "@/components/ui";
import type { TableColumn, BadgeVariant } from "@/types";

interface RecentVisitor {
  id: string;
  name: string;
  purpose: string;
  site: string;
  time: string;
  status: "Checked In" | "Pending" | "Checked Out";
}

const stats = [
  { label: "Total Visitors Today", value: "128", icon: Users, change: "+12%" },
  { label: "Pending Approvals", value: "9", icon: ClipboardCheck, change: "-3%" },
  { label: "Currently On-Site", value: "42", icon: Clock, change: "+5%" },
  { label: "Active Sites", value: "6", icon: Building2, change: "0%" },
];

const recentVisitors: RecentVisitor[] = [
  { id: "V-1042", name: "Rohit Sharma", purpose: "Meeting", site: "Tower A", time: "09:32 AM", status: "Checked In" },
  { id: "V-1041", name: "Meena Iyer", purpose: "Delivery", site: "Tower B", time: "09:15 AM", status: "Pending" },
  { id: "V-1040", name: "Contractor - ABC Elec.", purpose: "Maintenance", site: "Tower C", time: "08:50 AM", status: "Checked In" },
  { id: "V-1039", name: "Karan Mehta", purpose: "Interview", site: "Tower A", time: "08:20 AM", status: "Checked Out" },
  { id: "V-1038", name: "Priya Nair", purpose: "Meeting", site: "Tower B", time: "07:58 AM", status: "Checked Out" },
];

const statusVariant: Record<RecentVisitor["status"], BadgeVariant> = {
  "Checked In": "success",
  Pending: "warning",
  "Checked Out": "neutral",
};

const columns: TableColumn<RecentVisitor>[] = [
  { key: "id", header: "Visitor ID" },
  { key: "name", header: "Name" },
  { key: "purpose", header: "Purpose" },
  { key: "site", header: "Site" },
  { key: "time", header: "Time" },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

const Dashboard = () => {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of today's visitor and site activity."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="!p-0">
            <div className="p-4 sm:p-5 flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1.5">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5">
                  <ArrowUpRight size={12} />
                  {stat.change} vs yesterday
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                <stat.icon size={20} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <Card title="Recent Visitor Activity" subtitle="Latest check-ins across all sites" noPadding>
            <div className="p-4 sm:p-5">
              <Table columns={columns} data={recentVisitors} keyField="id" />
            </div>
          </Card>
        </div>

        <Card title="Approvals Pending" subtitle="Awaiting your action">
          <div className="space-y-3">
            {["Vendor - Sri Logistics", "Contractor - ABC Elec.", "Guest - Anita Rao"].map((name) => (
              <div
                key={name}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary-50/60"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{name}</p>
                  <p className="text-xs text-slate-500">Tower A · 10:00 AM</p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
