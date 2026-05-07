import StatCard from './StatCard';
import ChartCard from './ChartCard';
import PaymentsTable from './PaymentsTable';
import { DollarSign, ClipboardList, CheckCircle, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total revenue"
          value="$400"
          icon={DollarSign}
          trend={8.5}
          iconBgColor="bg-green-100"
          iconColor="text-green-500"
        />
        <StatCard
          title="Active tasks"
          value="40"
          icon={ClipboardList}
          trend={8.5}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Complete task"
          value="20"
          icon={CheckCircle}
          trend={8.5}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-500"
        />
        <StatCard
          title="Total users"
          value="400"
          icon={Users}
          trend={8.5}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-500"
        />
      </div>

      {/* Chart */}
      <ChartCard />

      {/* Payments Table */}
      <PaymentsTable />
    </div>
  );
}
