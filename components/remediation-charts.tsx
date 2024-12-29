import { useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RemediationMetrics {
  timestamp: string;
  activeCount: number;
  completedCount: number;
  failedCount: number;
  riskScore: number;
}

interface RemediationChartProps {
  data: RemediationMetrics[];
  statusCounts: {
    active: number;
    completed: number;
    failed: number;
  };
}

const COLORS = {
  active: '#10B981', // Green
  completed: '#3B82F6', // Blue
  failed: '#EF4444', // Red
  risk: '#8B5CF6', // Purple
};

export function RemediationCharts({ data, statusCounts }: RemediationChartProps) {
  const pieData = useMemo(
    () => [
      { name: 'Active', value: statusCounts.active, color: COLORS.active },
      { name: 'Completed', value: statusCounts.completed, color: COLORS.completed },
      { name: 'Failed', value: statusCounts.failed, color: COLORS.failed },
    ],
    [statusCounts]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Remediation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                />
                <Line
                  type="monotone"
                  dataKey="activeCount"
                  stroke={COLORS.active}
                  name="Active"
                />
                <Line
                  type="monotone"
                  dataKey="completedCount"
                  stroke={COLORS.completed}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="failedCount"
                  stroke={COLORS.failed}
                  name="Failed"
                />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke={COLORS.risk}
                  name="Risk Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} remediations`, name]}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {pieData.map((entry) => (
              <div key={entry.name}>
                <div
                  className="mx-auto h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="mt-1.5 text-sm font-medium">{entry.name}</div>
                <div className="text-2xl font-bold">{entry.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
