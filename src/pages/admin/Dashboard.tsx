import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, HeartPulse, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Geral</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/leads" className="block group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gerencie contatos</div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/treatments" className="block group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tratamentos</CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gestão Ativa</div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/blogs" className="block group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Artigos do Blog</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gestão CMS</div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/settings" className="block group">
          <Card className="h-full transition-all hover:shadow-md border-primary/20 bg-primary/5 group-hover:-translate-y-1 group-hover:bg-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                Configurações do Site
              </CardTitle>
              <Settings className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Acessar CMS</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
