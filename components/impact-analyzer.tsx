"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Server, Shield, Globe, LucideIcon } from 'lucide-react'

interface TechStackComponent {
  name: string
  icon: LucideIcon
}

interface ImpactAnalyzerProps {
  change: {
    description: string
    affectedSystems: string[]
    riskReduction: number
  }
  onClose: () => void
}

const techStackComponents: TechStackComponent[] = [
  { name: "Firewall", icon: Shield },
  { name: "Web Servers", icon: Globe },
  { name: "Application Servers", icon: Server },
  { name: "Database", icon: Server },
  { name: "Network Security", icon: Shield },
]

export function ImpactAnalyzer({ change, onClose }: ImpactAnalyzerProps) {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Impact Analysis: {change.description}</DialogTitle>
          <DialogDescription>
            Analyzing the impact of this change on the tech stack
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Affected Systems</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {change.affectedSystems.map((system) => (
              <Badge key={system} variant="secondary">{system}</Badge>
            ))}
          </div>
          <h3 className="font-semibold mb-2">Tech Stack Impact</h3>
          <div className="grid grid-cols-5 gap-4">
            {techStackComponents.map((component) => {
              const isAffected = change.affectedSystems.includes(component.name)
              const Icon = component.icon
              return (
                <div 
                  key={component.name} 
                  className={`p-4 rounded-lg border ${isAffected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'} flex flex-col items-center justify-center text-center`}
                >
                  <Icon className={`h-8 w-8 mb-2 ${isAffected ? 'text-yellow-500' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">{component.name}</span>
                  {isAffected && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-2" />}
                  {!isAffected && <CheckCircle className="h-4 w-4 text-green-500 mt-2" />}
                </div>
              )
            })}
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Risk Reduction</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${change.riskReduction}%` }}></div>
              </div>
              <span className="text-sm font-medium text-gray-500">{change.riskReduction}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This change is expected to reduce overall risk by {change.riskReduction}% by addressing vulnerabilities in {change.affectedSystems.join(' and ')}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
