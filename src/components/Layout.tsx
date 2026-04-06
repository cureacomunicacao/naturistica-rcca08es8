import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, Leaf } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const navLinks = [
  { name: 'Início', path: '/' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Tratamentos', path: '/tratamentos' },
  { name: 'Blog', path: '/blog' },
]

const treatmentsList = [
  { title: 'Ansiedade', slug: 'ansiedade' },
  { title: 'Insônia', slug: 'insonia' },
  { title: 'Burnout', slug: 'burnout' },
  { title: 'TDAH', slug: 'tdah' },
  { title: 'Trauma', slug: 'trauma' },
  { title: 'Enxaqueca', slug: 'enxaqueca' },
  { title: 'Fibromialgia', slug: 'fibromialgia' },
  { title: 'Dor crônica', slug: 'dor-cronica' },
]

export default function Layout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary selection:text-primary-foreground">
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 glass-header',
          isScrolled ? 'py-3' : 'py-5',
        )}
      >
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Leaf className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif text-2xl font-semibold tracking-wide text-primary">
              NATURISTICA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.name === 'Tratamentos' ? (
                <div key={link.path} className="relative group py-2">
                  <Link
                    to={link.path}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100',
                      location.pathname.startsWith('/tratamentos')
                        ? 'text-primary after:scale-x-100'
                        : 'text-muted-foreground',
                    )}
                  >
                    {link.name}
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-4">
                    <div className="bg-white rounded-xl shadow-xl border p-4 w-[500px] grid grid-cols-2 gap-2 before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                      {treatmentsList.map((t) => (
                        <Link
                          key={t.slug}
                          to={`/tratamentos/${t.slug}`}
                          className="block p-3 hover:bg-primary/5 rounded-lg text-sm text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {t.title}
                        </Link>
                      ))}
                      <div className="col-span-2 pt-3 mt-1 border-t">
                        <Link
                          to="/tratamentos"
                          className="block text-center text-sm text-primary hover:underline font-medium"
                        >
                          Ver todos os tratamentos →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100',
                    location.pathname === link.path
                      ? 'text-primary after:scale-x-100'
                      : 'text-muted-foreground',
                  )}
                >
                  {link.name}
                </Link>
              ),
            )}
            <Button className="rounded-full px-6 text-white hover:bg-primary/90">
              Agendar consulta online
            </Button>
          </nav>

          {/* Mobile Nav */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col pt-12">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <nav className="flex flex-col gap-6 text-lg font-serif mt-8">
                {navLinks.map((link) => (
                  <div key={link.path} className="flex flex-col gap-2">
                    <Link
                      to={link.path}
                      className={cn(
                        'transition-colors hover:text-primary font-medium',
                        location.pathname === link.path ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {link.name}
                    </Link>
                    {link.name === 'Tratamentos' && (
                      <div className="pl-4 flex flex-col gap-3 mt-2 border-l-2 border-primary/20">
                        {treatmentsList.map((t) => (
                          <Link
                            key={t.slug}
                            to={`/tratamentos/${t.slug}`}
                            className="text-base text-muted-foreground hover:text-primary"
                          >
                            {t.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-auto pb-8">
                <Button className="w-full rounded-full" size="lg">
                  Agendar consulta online
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-16 animate-fade-in-up">
        <Outlet />
      </main>

      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              <span className="font-serif text-2xl font-semibold tracking-wide">NATURISTICA</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
              Onde a ciência encontra a ancestralidade para saúde e consciência. Tratamento médico
              humanizado e integrativo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-serif font-semibold text-lg">Navegação</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif font-semibold text-lg">Tratamentos</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Ansiedade</li>
                <li>Insônia</li>
                <li>Burnout</li>
                <li>TDAH</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Contato</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>contato@naturistica.com.br</p>
              <p>+55 (11) 99999-9999</p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="rounded-full bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-white"
                >
                  Siga no Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-16 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Naturistica. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
