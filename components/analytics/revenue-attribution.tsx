"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Target, Users } from "lucide-react"

const attributionData = [
  {
    channel: "Organic Search",
    firstTouch: 15420,
    lastTouch: 8930,
    linear: 12175,
    timeDecay: 11200,
    position: 13800,
    color: "bg-green-500",
  },
  {
    channel: "Facebook Ads",
    firstTouch: 8750,
    lastTouch: 12340,
    linear: 10545,
    timeDecay: 11100,
    position: 9890,
    color: "bg-blue-500",
  },
  {
    channel: "Email Marketing",
    firstTouch: 3200,
    lastTouch: 9870,
    linear: 6535,
    timeDecay: 7200,
    position: 5800,
    color: "bg-purple-500",
  },
  {
    channel: "Direct Traffic",
    firstTouch: 12100,
    lastTouch: 6540,
    linear: 9320,
    timeDecay: 8100,
    position: 10200,
    color: "bg-orange-500",
  },
  {
    channel: "Referral",
    firstTouch: 2890,
    lastTouch: 4320,
    linear: 3605,
    timeDecay: 3800,
    position: 3200,
    color: "bg-pink-500",
  },
]

export function RevenueAttribution() {
  const totalRevenue = attributionData.reduce((sum, channel) => sum + channel.linear, 0)

  const attributionModels = [
    { key: "firstTouch", name: "First Touch", description: "Credits the first touchpoint" },
    { key: "lastTouch", name: "Last Touch", description: "Credits the last touchpoint" },
    { key: "linear", name: "Linear", description: "Equal credit to all touchpoints" },
    { key: "timeDecay", name: "Time Decay", description: "More credit to recent touchpoints" },
    { key: "position", name: "Position Based", description: "40% first, 40% last, 20% middle" },
  ]

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Revenue Attribution Analysis</span>
        </CardTitle>
        <CardDescription>Multi-touch attribution across your marketing channels</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="linear" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {attributionModels.map((model) => (
              <TabsTrigger key={model.key} value={model.key} className="text-xs">
                {model.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {attributionModels.map((model) => (
            <TabsContent key={model.key} value={model.key} className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg">{model.name} Attribution</h3>
                <p className="text-sm text-gray-600">{model.description}</p>
                <p className="text-2xl font-bold mt-2">
                  $
                  {attributionData
                    .reduce((sum, channel) => sum + channel[model.key as keyof typeof channel], 0)
                    .toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                {attributionData
                  .sort((a, b) => b[model.key as keyof typeof a] - a[model.key as keyof typeof a])
                  .map((channel) => {
                    const value = channel[model.key as keyof typeof channel] as number
                    const percentage = ((value / totalRevenue) * 100).toFixed(1)

                    return (
                      <div key={channel.channel} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-4 h-4 rounded ${channel.color}`}></div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{channel.channel}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">${value.toLocaleString()}</span>
                              <Badge variant="outline">{percentage}%</Badge>
                            </div>
                          </div>
                          <Progress value={Number.parseFloat(percentage)} className="h-2" />
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Channel Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-800">Top Performer</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {
                      attributionData.sort((a, b) => b[model.key as keyof typeof a] - a[model.key as keyof typeof a])[0]
                        .channel
                    }
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Avg. Attribution</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    $
                    {(
                      attributionData.reduce((sum, channel) => sum + channel[model.key as keyof typeof channel], 0) /
                      attributionData.length
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">Active Channels</span>
                  </div>
                  <p className="text-sm text-purple-700">{attributionData.length} channels</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Attribution Comparison */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-4">Attribution Model Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Channel</th>
                  {attributionModels.map((model) => (
                    <th key={model.key} className="text-right p-2">
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attributionData.map((channel) => (
                  <tr key={channel.channel} className="border-b">
                    <td className="p-2 font-medium">{channel.channel}</td>
                    {attributionModels.map((model) => (
                      <td key={model.key} className="text-right p-2">
                        ${(channel[model.key as keyof typeof channel] as number).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
