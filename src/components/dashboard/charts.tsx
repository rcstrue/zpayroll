'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { TrendingUp, Users, Building2 } from 'lucide-react';

// Employee Distribution by Client
const employeeDistributionData = [
  { name: 'Client A', employees: 45, fill: '#10b981' },
  { name: 'Client B', employees: 38, fill: '#0ea5e9' },
  { name: 'Client C', employees: 32, fill: '#f59e0b' },
  { name: 'Client D', employees: 28, fill: '#8b5cf6' },
  { name: 'Others', employees: 43, fill: '#64748b' },
];

// Monthly Payroll Trend
const payrollTrendData = [
  { month: 'Aug', gross: 4200000, net: 3500000, employer: 400000 },
  { month: 'Sep', gross: 4350000, net: 3620000, employer: 420000 },
  { month: 'Oct', gross: 4480000, net: 3750000, employer: 435000 },
  { month: 'Nov', gross: 4520000, net: 3780000, employer: 440000 },
  { month: 'Dec', gross: 4680000, net: 3900000, employer: 455000 },
  { month: 'Jan', gross: 4872500, net: 4050000, employer: 475000 },
];

// Department Distribution
const departmentData = [
  { department: 'Production', count: 85 },
  { department: 'Security', count: 45 },
  { department: 'Housekeeping', count: 38 },
  { department: 'Admin', count: 25 },
  { department: 'Maintenance', count: 22 },
  { department: 'Others', count: 33 },
];

const chartConfig = {
  employees: {
    label: 'Employees',
    color: '#10b981',
  },
  gross: {
    label: 'Gross',
    color: '#10b981',
  },
  net: {
    label: 'Net Pay',
    color: '#0ea5e9',
  },
  employer: {
    label: 'Employer Cost',
    color: '#f59e0b',
  },
} satisfies ChartConfig;

export function DashboardCharts() {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Employee Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Employee Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employeeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="employees"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {employeeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Payroll Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-600" />
            Payroll Trend (6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis 
                  className="text-xs"
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gross"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Gross Salary"
                />
                <Line
                  type="monotone"
                  dataKey="net"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9' }}
                  name="Net Pay"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Department Distribution Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-600" />
            Department-wise Employee Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis 
                  dataKey="department" 
                  type="category" 
                  className="text-xs"
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]}
                  name="Employees"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
