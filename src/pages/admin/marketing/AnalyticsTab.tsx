import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAnalyticsEvents, getLeadsCount } from '@/services/analytics'
import { subDays, format, startOfDay } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Users, MousePointerClick } from 'lucide-react'

export default function AnalyticsTab() {
  const [events, setEvents] = useState<any[]>([])
  const [leads, setLeads] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const thirtyDaysAgo = startOfDay(subDays(new Date(), 30)).toISOString().replace('T', ' ')
        const evts = await getAnalyticsEvents(`created >= "${thirtyDaysAgo}"`)
        const lds = await getLeadsCount()
        setEvents(evts)
        setLeads(lds)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const { views, clicks, chartData, topLinks } = useMemo(() => {
    const v = events.filter((e) => e.event_type === 'page_view')
    const c = events.filter((e) => e.event_type === 'click')

    const daysMap: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      daysMap[format(subDays(new Date(), i), 'MMM dd')] = 0
    }

    v.forEach((evt) => {
      const d = format(new Date(evt.created), 'MMM dd')
      if (daysMap[d] !== undefined) daysMap[d]++
    })

    const chData = Object.entries(daysMap).map(([date, views]) => ({ date, views }))

    const counts = c.reduce((acc: any, curr) => {
      const label = curr.label || curr.path
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})

    const tl = Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10)

    return { views: v.length, clicks: c.length, chartData: chData, topLinks: tl }
  }, [events])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visualizações de Página (30d)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{views}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cliques Registrados (30d)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads Gerados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitas ao longo do tempo (30 Dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ChartContainer config={{ views: { label: 'Visitas', color: 'hsl(var(--primary))' } }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={20}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    fillOpacity={1}
                    fill="url(#fillViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links Mais Clicados (Top 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação / Rótulo</TableHead>
                <TableHead className="text-right">Cliques (30d)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLinks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                    Nenhum clique registrado ainda.
                  </TableCell>
                </TableRow>
              )}
              {topLinks.map((link: any, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{link.label}</TableCell>
                  <TableCell className="text-right">{link.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
