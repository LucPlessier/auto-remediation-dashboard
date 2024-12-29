import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Settings } from 'lucide-react'

export function RecommendedActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-green-600" />
          Recommended Actions
        </CardTitle>
        <CardDescription>
          Automated suggestions to improve your security posture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Update firewall rules</p>
              <p className="text-sm text-muted-foreground">Restrict access to port 22 from public internet</p>
              <Button variant="outline" size="sm" className="mt-2">
                Apply Change
              </Button>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Patch vulnerable systems</p>
              <p className="text-sm text-muted-foreground">Apply security updates to 3 critical systems</p>
              <Button variant="outline" size="sm" className="mt-2">
                Schedule Update
              </Button>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">Enable MFA</p>
              <p className="text-sm text-muted-foreground">Enforce multi-factor authentication for all admin accounts</p>
              <Button variant="outline" size="sm" className="mt-2">
                Configure MFA
              </Button>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

