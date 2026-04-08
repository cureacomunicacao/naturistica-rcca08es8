import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SeoTab from './marketing/SeoTab'
import ScriptsTab from './marketing/ScriptsTab'
import AnalyticsTab from './marketing/AnalyticsTab'

export default function MarketingAdmin() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-serif">Marketing & SEO</h1>
        <p className="text-muted-foreground">
          Gerencie meta tags, scripts de rastreamento e métricas de desempenho.
        </p>
      </div>
      <Tabs defaultValue="seo">
        <TabsList className="mb-4">
          <TabsTrigger value="seo">Global SEO</TabsTrigger>
          <TabsTrigger value="scripts">Scripts & GMB</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="seo">
          <SeoTab />
        </TabsContent>
        <TabsContent value="scripts">
          <ScriptsTab />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
