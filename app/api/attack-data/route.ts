import { NextResponse } from 'next/server'

export async function GET() {
  // In a real-world scenario, this data would come from a database or external API
  const attackData = {
    steps: [
      {
        id: 1,
        name: "Initial Access",
        description: "Phishing email compromises user credentials",
        type: "Initial Access",
        target: "User Workstation",
        threatActor: "BlackBasta",
        technique: "T1566 - Phishing",
        details: "Sophisticated phishing campaign targeting specific employees",
        indicators: ["Suspicious email patterns", "Unusual login attempts"],
        mitigation: "Enhanced email filtering and security awareness training"
      }
    ],
    threatActors: [
      {
        id: "TA001",
        name: "BlackBasta",
        type: "Ransomware Group",
        sophistication: 85,
        motivation: ["Financial gain", "Data theft"],
        recentTargets: ["Manufacturing", "Healthcare", "Technology"],
        associatedTechniques: ["T1566", "T1078", "T1048"]
      }
    ],
    attackTechniques: [
      {
        id: "T1566",
        name: "Phishing",
        description: "Adversaries may send phishing messages to gain access to victim systems",
        mitreTactic: "Initial Access",
        severity: "High",
        usedBy: ["BlackBasta", "LockBit"]
      }
    ]
  }

  return NextResponse.json(attackData)
}
