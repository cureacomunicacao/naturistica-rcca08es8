import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Stethoscope, Users, BookOpen, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  const menu = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Tratamentos', path: '/admin/treatments', icon: Stethoscope },
    { name: 'Blog', path: '/admin/blogs', icon: BookOpen },
    { name: 'Leads', path: '/admin/leads', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="font-serif font-bold text-xl text-primary">Naturistica Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium',
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
