import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, AlertTriangle, Shield, BotIcon as Robot, DollarSign, Server, Laptop, Database, Cloud, Lock, ChevronDown, ChevronUp } from 'lucide-react'

interface AttackStep {
  id: number
  name: string
  description: string
  type: string
  target: keyof typeof ITComponents
  details?: string
  indicators?: string[]
  mitigation?: string
}

interface AttackTrace {
  id: number
  name: string
  riskScore: number
  threatActor: string
  steps: AttackStep[]
  impactForecast: string
  riskMitigation: string
  dollarValue: number
}

interface SyntheticAttack {
  id: number
  name: string
  riskScore: number
  steps: AttackStep[]
  discoveredVulnerabilities: string[]
}

const attackTraces: AttackTrace[] = [
  {
    id: 1,
    name: "Credential Theft and Lateral Movement",
    riskScore: 85,
    threatActor: "APT29",
    steps: [
      { 
        id: 1, 
        name: "Initial Access", 
        description: "Phishing email compromises user credentials", 
        type: "Initial Access", 
        target: "User Workstation",
        details: "The attacker sends a carefully crafted phishing email to an employee, tricking them into revealing their login credentials. This gives the attacker initial access to the organization's network.",
        indicators: ["Suspicious email activity", "Unusual login patterns"],
        mitigation: "Implement robust email filtering and user awareness training."
      },
      { 
        id: 2, 
        name: "Lateral Movement", 
        description: "Attacker moves to HR server using stolen credentials", 
        type: "Lateral Movement", 
        target: "HR Server",
        details: "Using the stolen credentials, the attacker navigates through the network and gains access to the HR server, which contains sensitive employee information.",
        indicators: ["Unexpected admin actions", "Unusual data access patterns"],
        mitigation: "Implement network segmentation and multi-factor authentication."
      },
      { 
        id: 3, 
        name: "Privilege Escalation", 
        description: "Exploits zero-day vulnerability in HR software", 
        type: "Privilege Escalation", 
        target: "HR Server",
        details: "The attacker exploits a previously unknown vulnerability in the HR software to gain elevated privileges on the HR server.",
        indicators: ["Unexpected privilege changes", "Unusual process executions"],
        mitigation: "Regularly update and patch software, implement least privilege principle."
      },
      { 
        id: 4, 
        name: "Data Exfiltration", 
        description: "Exfiltrates sensitive employee data", 
        type: "Data Exfiltration", 
        target: "Database",
        details: "With elevated privileges, the attacker accesses and exfiltrates sensitive employee data from the HR database.",
        indicators: ["Large data transfers", "Connections to unknown IP addresses"],
        mitigation: "Implement data loss prevention (DLP) solutions and monitor network traffic."
      },
    ],
    impactForecast: "High potential for data breach and reputational damage",
    riskMitigation: "Implement MFA, segment HR network, patch HR software",
    dollarValue: 500000,
  },
  {
    id: 2,
    name: "Cloud Misconfiguration Exploit",
    riskScore: 78,
    threatActor: "Lazarus Group",
    steps: [
      { id: 1, name: "Discovery", description: "Discovers misconfigured S3 bucket", type: "Discovery", target: "Cloud Storage" },
      { id: 2, name: "Data Collection", description: "Accesses and exfiltrates sensitive data", type: "Collection", target: "Cloud Storage" },
      { id: 3, name: "Lateral Movement", description: "Uses stolen data to target other systems", type: "Lateral Movement", target: "Internal Network" },
    ],
    impactForecast: "Medium-term data exposure, potential for further attacks",
    riskMitigation: "Review and correct S3 bucket permissions, implement cloud security posture management",
    dollarValue: 350000,
  },
]

const syntheticAttacks: SyntheticAttack[] = [
  {
    id: 1,
    name: "AI-Driven Social Engineering",
    riskScore: 72,
    steps: [
      { id: 1, name: "Initial Access", description: "AI generates targeted phishing campaign", type: "Initial Access", target: "User Workstation" },
      { id: 2, name: "Privilege Escalation", description: "Compromises executive account", type: "Privilege Escalation", target: "User Workstation" },
      { id: 3, name: "Impact", description: "Manipulates financial transactions", type: "Impact", target: "Financial System" },
    ],
    discoveredVulnerabilities: ["Weak email filtering", "Insufficient executive training"],
  },
  {
    id: 2,
    name: "Automated Lateral Movement",
    riskScore: 68,
    steps: [
      { id: 1, name: "Initial Access", description: "Exploits known vulnerability in web server", type: "Initial Access", target: "Web Server" },
      { id: 2, name: "Discovery", description: "Scans internal network for vulnerable systems", type: "Discovery", target: "Internal Network" },
      { id: 3, name: "Lateral Movement", description: "Propagates through network using multiple exploits", type: "Lateral Movement", target: "Multiple Servers" },
    ],
    discoveredVulnerabilities: ["Unpatched systems", "Weak network segmentation"],
  },
]

const ITComponents = {
  "User Workstation": Laptop,
  "HR Server": Server,
  "Database": Database,
  "Cloud Storage": Cloud,
  "Internal Network": Network,
  "Financial System": DollarSign,
  "Web Server": Server,
  "Multiple Servers": Server,
}

interface AttackFlowProps {
  steps: AttackStep[]
  selectedStep: AttackStep | null
  onStepClick: (step: AttackStep) => void
}

function AttackFlow({ steps, selectedStep, onStepClick }: AttackFlowProps) {
  return (
    <div className="relative h-[400px] border rounded-lg p-4 bg-gray-50">
      <svg className="absolute top-0 left-0 w-full h-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
          </marker>
        </defs>
      </svg>
      {Object.entries(ITComponents).map(([name, Icon], index) => {
        const x = (index % 4) * 25 + 12.5;
        const y = Math.floor(index / 4) * 33 + 16.5;
        return (
          <div
            key={name}
            className="absolute flex flex-col items-center justify-center w-20 h-20 -mt-10 -ml-10 bg-white border-2 border-gray-200 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            <Icon className="h-8 w-8 text-gray-600" />
            <span className="text-xs mt-1 text-center">{name}</span>
          </div>
        );
      })}
      {steps.map((step, index) => {
        if (index === 0) return null;
        const startComponent = steps[index - 1];
        const endComponent = step;
        const startPos = Object.keys(ITComponents).indexOf(startComponent.target);
        const endPos = Object.keys(ITComponents).indexOf(endComponent.target);
        const startX = (startPos % 4) * 25 + 12.5;
        const startY = Math.floor(startPos / 4) * 33 + 16.5;
        const endX = (endPos % 4) * 25 + 12.5;
        const endY = Math.floor(endPos / 4) * 33 + 16.5;

        return (
          <svg key={step.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <line
              x1={`${startX}%`}
              y1={`${startY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke={selectedStep?.id === step.id ? "#22c55e" : "#9ca3af"}
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        );
      })}
      {steps.map((step, index) => {
        const pos = Object.keys(ITComponents).indexOf(step.target);
        const x = (pos % 4) * 25 + 12.5;
        const y = Math.floor(pos / 4) * 33 + 16.5;
        return (
          <div
            key={step.id}
            className={`absolute flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
              selectedStep?.id === step.id ? 'bg-green-600 text-white scale-125' : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-green-600'
            }`}
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => onStepClick(step)}
          >
            {step.id}
          </div>
        );
      })}
    </div>
  )
}

interface AttackStepDetailsProps {
  step: AttackStep
}

function AttackStepDetails({ step }: AttackStepDetailsProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <h4 className="font-semibold text-lg">{step.id}. {step.name}</h4>
        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      <p className="text-sm text-gray-600 mt-2">{step.description}</p>
      {expanded && (
        <div className="mt-4 space-y-3">
          <div>
            <h5 className="font-semibold">Details:</h5>
            <p className="text-sm">{step.details}</p>
          </div>
          <div>
            <h5 className="font-semibold">Indicators:</h5>
            <ul className="list-disc list-inside text-sm">
              {step.indicators?.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Mitigation:</h5>
            <p className="text-sm">{step.mitigation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function EnhancedAttackTrace() {
  const [selectedAttack, setSelectedAttack] = useState<AttackTrace>(attackTraces[0])
  const [selectedSyntheticAttack, setSelectedSyntheticAttack] = useState<SyntheticAttack>(syntheticAttacks[0])
  const [selectedStep, setSelectedStep] = useState<AttackStep | null>(null)
  const [expandedAttacks, setExpandedAttacks] = useState<{ [key: number]: boolean }>({})

  const toggleAttack = (attackId: number) => {
    setExpandedAttacks(prev => ({
      ...prev,
      [attackId]: !prev[attackId]
    }))
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-4 w-4 text-green-600" />
          Enhanced Attack Trace Analysis
        </CardTitle>
        <CardDescription>
          Analyze historical and AI-simulated attack paths with detailed impact assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="historical" className="space-y-4">
          <TabsList>
            <TabsTrigger value="historical">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Historical Traces
            </TabsTrigger>
            <TabsTrigger value="synthetic">
              <Robot className="h-4 w-4 mr-2" />
              Synthetic Attacks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="historical" className="space-y-4">
            <div className="grid gap-4">
              {attackTraces.map(attack => (
                <div key={attack.id} className="border rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleAttack(attack.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={attack.riskScore > 80 ? "destructive" : "secondary"}>
                        Risk Score: {attack.riskScore}
                      </Badge>
                      <h3 className="font-semibold">{attack.name}</h3>
                      <Badge variant="outline">{attack.threatActor}</Badge>
                    </div>
                    {expandedAttacks[attack.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>

                  {expandedAttacks[attack.id] && (
                    <div className="mt-4 space-y-4">
                      <AttackFlow
                        steps={attack.steps}
                        selectedStep={selectedStep}
                        onStepClick={setSelectedStep}
                      />
                      {selectedStep && <AttackStepDetails step={selectedStep} />}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-semibold mb-2">Impact Forecast</h4>
                          <p className="text-gray-600">{attack.impactForecast}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Risk Mitigation</h4>
                          <p className="text-gray-600">{attack.riskMitigation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>Estimated Impact: ${attack.dollarValue.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="synthetic" className="space-y-4">
            <div className="grid gap-4">
              {syntheticAttacks.map(attack => (
                <div key={attack.id} className="border rounded-lg p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleAttack(attack.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={attack.riskScore > 70 ? "destructive" : "secondary"}>
                        Risk Score: {attack.riskScore}
                      </Badge>
                      <h3 className="font-semibold">{attack.name}</h3>
                    </div>
                    {expandedAttacks[attack.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>

                  {expandedAttacks[attack.id] && (
                    <div className="mt-4 space-y-4">
                      <AttackFlow
                        steps={attack.steps}
                        selectedStep={selectedStep}
                        onStepClick={setSelectedStep}
                      />
                      {selectedStep && <AttackStepDetails step={selectedStep} />}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Discovered Vulnerabilities</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {attack.discoveredVulnerabilities.map((vuln, index) => (
                            <li key={index}>{vuln}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
