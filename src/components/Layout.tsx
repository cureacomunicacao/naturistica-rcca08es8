import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, Leaf } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'
import { useRealtime } from '@/hooks/use-realtime'
import { ScheduleDialog } from '@/components/ScheduleDialog'

export default function Layout() {
  const location = useLocation()
  const { settings } = useSettings()

  const [navLinks, setNavLinks] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [treatmentsList, setTreatmentsList] = useState<{ title: string; slug: string }[]>([])

  const fetchNavigation = () => {
    pb.collection('navigation_links')
      .getFullList({ filter: 'active = true', sort: 'order,created' })
      .then(setNavLinks)
      .catch(console.error)
  }

  const fetchTreatments = () => {
    pb.collection('treatments')
      .getFullList({ filter: 'active = true', sort: 'order,created' })
      .then((records) => {
        setTreatmentsList(records.map((r) => ({ title: r.title, slug: r.slug })))
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchNavigation()
    fetchTreatments()
  }, [])

  useRealtime('navigation_links', fetchNavigation)
  useRealtime('treatments', fetchTreatments)

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

  const getSEO = () => {
    if (location.pathname === '/')
      return { title: settings.home_meta_title?.value, desc: settings.home_meta_description?.value }
    if (location.pathname === '/sobre')
      return {
        title: settings.about_meta_title?.value,
        desc: settings.about_meta_description?.value,
      }
    if (location.pathname.startsWith('/tratamentos'))
      return {
        title: settings.treatments_meta_title?.value,
        desc: settings.treatments_meta_description?.value,
      }
    if (location.pathname.startsWith('/blog'))
      return { title: settings.blog_meta_title?.value, desc: settings.blog_meta_description?.value }
    return {}
  }
  const seo = getSEO()

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary selection:text-primary-foreground">
      <SEO title={seo.title} description={seo.desc} />
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500',
          isScrolled ? 'py-3' : 'py-6',
        )}
      >
        {/* Organic Wavy Background */}
        <div className="absolute inset-x-0 top-0 h-full bg-white pointer-events-none z-[-1]"></div>
        <svg
          className="absolute inset-x-0 top-full w-full h-[30px] text-white pointer-events-none z-[-1] drop-shadow-[0_4px_4px_rgba(0,0,0,0.03)]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 30"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 C480,40 960,-20 1440,15 L1440,0 L0,0 Z" />
        </svg>

        <div className="container relative z-10 transition-all duration-500">
          <div className="flex items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.global_logo?.image ? (
                <img
                  src={pb.files.getUrl(settings.global_logo, settings.global_logo.image)}
                  alt="Naturistica"
                  className="h-8 object-contain"
                />
              ) : (
                <>
                  <Leaf className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-serif text-2xl font-semibold tracking-wide text-primary">
                    {settings.global_brand_name?.value || 'NATURISTICA'}
                  </span>
                </>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.href === '/tratamentos' ? (
                  <div key={link.id || link.href} className="relative group py-2">
                    <Link
                      to={link.href}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100',
                        location.pathname.startsWith('/tratamentos')
                          ? 'text-primary after:scale-x-100'
                          : 'text-muted-foreground',
                      )}
                    >
                      {link.label}
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
                    key={link.id || link.href}
                    to={link.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100',
                      location.pathname === link.href
                        ? 'text-primary after:scale-x-100'
                        : 'text-muted-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <ScheduleDialog>
                <Button className="rounded-full px-6 text-white hover:bg-primary/90 cursor-pointer">
                  {settings.global_cta_text?.value || 'Agendar consulta online'}
                </Button>
              </ScheduleDialog>
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
                    <div key={link.id || link.href} className="flex flex-col gap-2">
                      <Link
                        to={link.href}
                        className={cn(
                          'transition-colors hover:text-primary font-medium',
                          location.pathname === link.href
                            ? 'text-primary'
                            : 'text-muted-foreground',
                        )}
                      >
                        {link.label}
                      </Link>
                      {link.href === '/tratamentos' && (
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
                  <ScheduleDialog>
                    <Button className="w-full rounded-full cursor-pointer" size="lg">
                      {settings.global_cta_text?.value || 'Agendar consulta online'}
                    </Button>
                  </ScheduleDialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 animate-fade-in-up">
        <Outlet />
      </main>

      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              {settings?.global_logo?.image ? (
                <img
                  src={pb.files.getUrl(settings.global_logo, settings.global_logo.image)}
                  alt="Naturistica"
                  className="h-8 object-contain brightness-0 invert"
                />
              ) : (
                <>
                  <Leaf className="h-6 w-6" />
                  <span className="font-serif text-2xl font-semibold tracking-wide">
                    {settings.global_brand_name?.value || 'NATURISTICA'}
                  </span>
                </>
              )}
            </Link>
            <p className="text-primary-foreground/80 text-sm max-w-xs leading-relaxed">
              {settings.footer_description?.value ||
                'Onde a ciência encontra a ancestralidade para saúde e consciência. Tratamento médico humanizado e integrativo.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-serif font-semibold text-lg">
                {settings.footer_nav_title?.value || 'Navegação'}
              </h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                {navLinks.map((link) => (
                  <li key={link.id || link.href}>
                    <Link to={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif font-semibold text-lg">
                {settings.footer_treatments_title?.value || 'Tratamentos'}
              </h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                {treatmentsList.slice(0, 5).map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={`/tratamentos/${t.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">
              {settings.footer_contact_title?.value || 'Contato'}
            </h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              {null}
              <p>
                {settings?.contact_email?.value ||
                  settings?.global_email?.value ||
                  'contato@naturistica.com.br'}
              </p>
              <p>{settings?.global_phone?.value || '+55 (43) 99169-2047'}</p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full bg-primary-foreground/10 text-white border-primary-foreground/20 hover:bg-primary-foreground/20 hover:text-white transition-colors"
                >
                  <a
                    href={settings?.global_instagram?.value || 'https://instagram.com'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {settings.footer_instagram_btn?.value || 'Siga no Instagram'}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-16 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>
            {(
              settings.footer_copyright?.value ||
              '© {year} Naturistica. Todos os direitos reservados.'
            ).replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </footer>
    </div>
  )
}
