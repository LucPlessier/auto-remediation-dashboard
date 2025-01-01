import { NextResponse } from "next/server"

interface Node {
  id: string
  type: 'asset' | 'vulnerability' | 'attack' | 'impact'
  label: string
  details: Record<string, any>
  risk: number
}

interface Edge {
  source: string
  target: string
  probability: number
  type: 'exploit' | 'lateral_movement' | 'privilege_escalation'
}

interface AttackPath {
  nodes: Node[]
  edges: Edge[]
}

const dummyAttackPaths: AttackPath = {
  nodes: [
    {
      id: 'web-server',
      type: 'asset',
      label: 'Web Server',
      details: {
        hostname: 'web-01',
        ip: '10.0.1.10',
        services: ['http', 'https']
      },
      risk: 0.8
    },
    {
      id: 'cve-2023-1234',
      type: 'vulnerability',
      label: 'SQL Injection',
      details: {
        cve: 'CVE-2023-1234',
        cvss: 8.5,
        description: 'SQL injection vulnerability in login form'
      },
      risk: 0.9
    },
    {
      id: 'db-server',
      type: 'asset',
      label: 'Database Server',
      details: {
        hostname: 'db-01',
        ip: '10.0.1.20',
        services: ['mysql']
      },
      risk: 0.7
    },
    {
      id: 'data-exfil',
      type: 'attack',
      label: 'Data Exfiltration',
      details: {
        technique: 'T1048',
        description: 'Exfiltration over alternative protocol'
      },
      risk: 0.85
    },
    {
      id: 'admin-creds',
      type: 'impact',
      label: 'Admin Credentials Compromised',
      details: {
        severity: 'Critical',
        affected_systems: ['web-01', 'db-01']
      },
      risk: 0.95
    }
  ],
  edges: [
    {
      source: 'web-server',
      target: 'cve-2023-1234',
      probability: 0.8,
      type: 'exploit'
    },
    {
      source: 'cve-2023-1234',
      target: 'db-server',
      probability: 0.7,
      type: 'lateral_movement'
    },
    {
      source: 'db-server',
      target: 'data-exfil',
      probability: 0.6,
      type: 'exploit'
    },
    {
      source: 'data-exfil',
      target: 'admin-creds',
      probability: 0.9,
      type: 'privilege_escalation'
    }
  ]
}

export async function GET() {
  try {
    return NextResponse.json(dummyAttackPaths)
  } catch (error) {
    console.error('Error fetching attack paths:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
