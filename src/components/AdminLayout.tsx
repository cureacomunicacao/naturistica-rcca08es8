import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  FileText,
  Settings,
  BarChart,
  Megaphone,
  LogOut,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Tratamentos', path: '/admin/treatments', icon: Stethoscope },
  { name: 'Leads', path: '/admin/leads', icon: Users },
  { name: 'Blog', path: '/admin/blogs', icon: FileText },
  { name: 'Depoimentos', path: '/admin/testimonials', icon: MessageSquare },
  { name: 'Página Inicial', path: '/admin/settings/home', icon: Settings },
  { name: 'Identidade Visual', path: '/admin/settings/visual', icon: Settings },
  { name: 'Configurações', path: '/admin/settings', icon: Settings },
  { name: 'Insights', path: '/admin/insights', icon: BarChart },
  { name: 'Marketing & SEO', path: '/admin/marketing', icon: Megaphone },
]

export default function AdminLayout() {
  const location = useLocation()
  const { signOut, user, isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 bg-background border-r flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-serif font-bold text-xl text-primary">Naturistica Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
