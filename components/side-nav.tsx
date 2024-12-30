import Link from "next/link"
import { cn } from "@/app/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Shield, Search, Activity, Globe, AlertTriangle, Brain, Network, UserCheck, BarChart, Settings, GitCompare, FileCode } from 'lucide-react'

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Deployment", icon: Shield, href: "/deployment" },
  { name: "Discovery", icon: Search, href: "/discovery" },
  { name: "Monitoring", icon: Activity, href: "/monitoring" },
  { name: "Internet Exposure", icon: Globe, href: "/internet-exposure" },
  { name: "Threat Intel", icon: AlertTriangle, href: "/threat-intel" },
  { name: "CVE Forecasting", icon: Brain, href: "/cve-forecasting" },
  { name: "Attack Paths", icon: Network, href: "/attack-paths" },
  { name: "User Behavior", icon: UserCheck, href: "/user-behavior" },
  { name: "Risk Algorithm", icon: BarChart, href: "/risk-algorithm" },
  { name: "Controls", icon: Settings, href: "/controls" },
  { name: "Change Impact", icon: GitCompare, href: "/change-impact" },
  { name: "Integrations", icon: FileCode, href: "/integrations" },
]

export function SideNav() {
  return (
    <div className="hidden border-r bg-green-900 lg:block dark:bg-green-950">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold text-white" href="/">
            <Shield className="h-6 w-6" />
            <span className="">CTEM Enterprise</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 overflow-auto">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Button key={item.name} asChild variant="ghost" className="w-full justify-start text-white hover:bg-green-800">
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
