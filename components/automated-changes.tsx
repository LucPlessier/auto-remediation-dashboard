import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { ImpactAnalyzer } from "./impact-analyzer"

interface AutomatedChange {
  id: number
  description: string
  status: 'Completed' | 'In Progress' | 'Scheduled'
  timestamp: string
  impact: 'Low' | 'Medium' | 'High'
  affectedSystems: string[]
  riskReduction: number
}

const changes: AutomatedChange[] = [
  { 
    id: 1, 
    description: "Updated firewall rules to block suspicious IP range", 
    status: "Completed", 
    timestamp: "2 hours ago",
    impact: "Low",
    affectedSystems: ["Firewall", "Network Security"],
    riskReduction: 15
  },
  { 
    id: 2, 
    description: "Patched 3 non-critical vulnerabilities on dev servers", 
    status: "Completed", 
    timestamp: "4 hours ago",
    impact: "Low",
    affectedSystems: ["Development Servers", "Application Security"],
    riskReduction: 8
  },
  { 
    id: 3, 
    description: "Optimized WAF rules for improved performance", 
    status: "In Progress", 
    timestamp: "10 minutes ago",
    impact: "Low",
    affectedSystems: ["Web Application Firewall", "Application Security"],
    riskReduction: 12
  },
  { 
    id: 4, 
    description: "Updated SSL certificates for non-production domains", 
    status: "Scheduled", 
    timestamp: "In 2 hours",
    impact: "Low",
    affectedSystems: ["Development Servers", "Network Security"],
    riskReduction: 5
  },
]

export function AutomatedChanges() {
  const [selectedChange, setSelectedChange] = useState<AutomatedChange | null>(null)

  const getStatusIcon = (status: AutomatedChange['status']) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 mt-0.5 text-yellow-500" />
      case "Scheduled":
        return <AlertCircle className="h-5 w-5 mt-0.5 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          Automated Changes
        </CardTitle>
        <CardDescription>
          Low-risk changes automatically implemented or scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {changes.map((change) => (
            <li key={change.id} className="flex items-start gap-4">
              {getStatusIcon(change.status)}
              <div>
                <p className="font-medium">{change.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={change.status === "Completed" ? "default" : "secondary"}>
                    {change.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{change.timestamp}</span>
                  <Badge variant="outline" className="bg-green-50">Low Impact</Badge>
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm text-blue-600 hover:underline"
                  onClick={() => setSelectedChange(change)}
                >
                  View Impact Analysis
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {selectedChange && (
          <ImpactAnalyzer 
            change={selectedChange} 
            onClose={() => setSelectedChange(null)} 
          />
        )}
      </CardContent>
    </Card>
  )
}
