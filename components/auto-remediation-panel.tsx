import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import { RemediationCharts } from './remediation-charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RemediationMetrics {
  timestamp: string;
  activeCount: number;
  completedCount: number;
  failedCount: number;
  riskScore: number;
}

interface RemediationStatus {
  isRunning: boolean;
  activeRemediations: number;
  completedRemediations: number;
  failedRemediations: number;
  lastUpdate: Date;
  config: RemediationConfig;
  metrics: RemediationMetrics[];
}

interface RemediationConfig {
  safeImpactThreshold: number;
  maxAffectedSystems: number;
  riskThreshold: number;
  systemicThreshold: number;
  monitoringInterval: number;
}

export function AutoRemediationPanel() {
  const [status, setStatus] = useState<RemediationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/auto-remediation');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch auto-remediation status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (config: Partial<RemediationConfig>) => {
    try {
      setUpdating(true);
      const response = await fetch('/api/auto-remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...status?.config, ...config }),
      });
      
      if (!response.ok) throw new Error('Failed to update config');
      
      toast({
        title: 'Success',
        description: 'Auto-remediation configuration updated',
      });
      
      await fetchStatus();
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update configuration',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Icons.spinner className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Failed to load auto-remediation status
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Auto Remediation
          <Switch
            checked={status.isRunning}
            onCheckedChange={(checked) => updateConfig({ enabled: checked })}
            disabled={updating}
          />
        </CardTitle>
        <CardDescription>
          Automatically remediate security issues based on risk and impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {status.activeRemediations}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {status.completedRemediations}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {status.failedRemediations}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {/* Charts */}
            <RemediationCharts
              data={status.metrics}
              statusCounts={{
                active: status.activeRemediations,
                completed: status.completedRemediations,
                failed: status.failedRemediations,
              }}
            />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            {/* Configuration Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Safe Impact Threshold</Label>
                <Slider
                  value={[status.config.safeImpactThreshold * 100]}
                  onValueChange={([value]) =>
                    updateConfig({ safeImpactThreshold: value / 100 })
                  }
                  max={100}
                  step={1}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Affected Systems</Label>
                <Input
                  type="number"
                  value={status.config.maxAffectedSystems}
                  onChange={(e) =>
                    updateConfig({ maxAffectedSystems: parseInt(e.target.value) })
                  }
                  min={1}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label>Risk Threshold</Label>
                <Slider
                  value={[status.config.riskThreshold * 100]}
                  onValueChange={([value]) =>
                    updateConfig({ riskThreshold: value / 100 })
                  }
                  max={100}
                  step={1}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label>Systemic Threshold</Label>
                <Slider
                  value={[status.config.systemicThreshold * 100]}
                  onValueChange={([value]) =>
                    updateConfig({ systemicThreshold: value / 100 })
                  }
                  max={100}
                  step={1}
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label>Monitoring Interval (seconds)</Label>
                <Input
                  type="number"
                  value={status.config.monitoringInterval}
                  onChange={(e) =>
                    updateConfig({ monitoringInterval: parseInt(e.target.value) })
                  }
                  min={60}
                  disabled={updating}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-sm text-muted-foreground">
          Last updated: {new Date(status.lastUpdate).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
