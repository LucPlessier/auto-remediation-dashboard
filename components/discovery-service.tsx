import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search } from "lucide-react"
import { useState, useEffect } from "react"

interface AssetDiscovery {
  totalAssets: number
  newAssets: number
  scanProgress: number
  categories: {
    name: string
    count: number
    percentage: number
  }[]
  lastScanTime: string
  nextScanTime: string
}

export function DiscoveryService() {
  const [data, setData] = useState<AssetDiscovery | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDiscoveryData() {
      try {
        const response = await fetch('/api/discovery')
        if (!response.ok) throw new Error('Failed to fetch discovery data')
        const discoveryData = await response.json()
        setData(discoveryData)
        setError(null)
      } catch (error) {
        console.error('Error fetching discovery data:', error)
        setError('Failed to load discovery service')
        // Fallback to sample data
        setData({
          totalAssets: 1250,
          newAssets: 15,
          scanProgress: 78,
          categories: [
            { name: 'Servers', count: 450, percentage: 36 },
            { name: 'Workstations', count: 580, percentage: 46.4 },
            { name: 'Network Devices', count: 120, percentage: 9.6 },
            { name: 'IoT Devices', count: 100, percentage: 8 }
          ],
          lastScanTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          nextScanTime: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscoveryData()
    const interval = setInterval(fetchDiscoveryData, 60 * 1000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Asset Discovery</CardTitle>
        <Search className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{data.totalAssets}</div>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
              {data.newAssets > 0 && (
                <div className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded">
                  +{data.newAssets} new
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scan Progress</span>
                <span>{data.scanProgress}%</span>
              </div>
              <Progress value={data.scanProgress} className="h-2" />
            </div>

            <div className="space-y-3">
              {data.categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span>{category.count}</span>
                  </div>
                  <Progress value={category.percentage} className="h-1" />
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-2">
              <div className="text-xs text-muted-foreground">
                Last scan: {new Date(data.lastScanTime).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Next scan: {new Date(data.nextScanTime).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
