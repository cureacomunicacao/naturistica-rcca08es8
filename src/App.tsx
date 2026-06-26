import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import { AuthProvider } from './hooks/use-auth'
import Index from './pages/Index'
import Sobre from './pages/Sobre'
import Tratamentos from './pages/Tratamentos'
import TratamentoDetalhe from './pages/TratamentoDetalhe'
import Blog from './pages/Blog'
import BlogPostDetail from './pages/BlogPostDetail'
import Contato from './pages/Contato'
import Obrigado from './pages/Obrigado'
import NotFound from './pages/NotFound'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import TreatmentsAdmin from './pages/admin/TreatmentsAdmin'
import LeadsAdmin from './pages/admin/LeadsAdmin'
import BlogAdmin from './pages/admin/BlogAdmin'
import BlogCategoriesAdmin from './pages/admin/BlogCategoriesAdmin'
import BlogPostForm from './pages/admin/BlogPostForm'
import SiteSettingsAdmin from './pages/admin/SiteSettingsAdmin'
import MediaSettingsAdmin from './pages/admin/MediaSettingsAdmin'
import ContentInsightsAdmin from './pages/admin/ContentInsightsAdmin'
import HomeSettingsAdmin from './pages/admin/HomeSettingsAdmin'
import VisualIdentityAdmin from './pages/admin/VisualIdentityAdmin'

import PageSectionsAdmin from './pages/admin/PageSectionsAdmin'
import PageSectionForm from './pages/admin/PageSectionForm'

import TestimonialsAdmin from './pages/admin/TestimonialsAdmin'
import MarketingAdmin from './pages/admin/MarketingAdmin'
import { SettingsProvider } from './hooks/use-settings'
import { AnalyticsTracker, ScriptInjector } from './components/TrackingScripts'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AdminModeProvider } from './hooks/use-admin-mode'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <SettingsProvider>
        <AdminModeProvider>
          <AnalyticsTracker />
          <ScriptInjector />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/tratamentos" element={<Tratamentos />} />
                  <Route path="/tratamentos/:slug" element={<TratamentoDetalhe />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPostDetail />} />
                  <Route path="/contato" element={<Contato />} />
                  <Route path="/obrigado" element={<Obrigado />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="treatments" element={<TreatmentsAdmin />} />
                  <Route path="leads" element={<LeadsAdmin />} />
                  <Route path="blogs" element={<BlogAdmin />} />
                  <Route path="blogs/categories" element={<BlogCategoriesAdmin />} />
                  <Route path="blogs/new" element={<BlogPostForm />} />
                  <Route path="blogs/:id" element={<BlogPostForm />} />
                  <Route path="settings" element={<SiteSettingsAdmin />} />
                  <Route path="settings/home" element={<HomeSettingsAdmin />} />
                  <Route path="sections" element={<PageSectionsAdmin />} />
                  <Route path="sections/new" element={<PageSectionForm />} />
                  <Route path="sections/:id" element={<PageSectionForm />} />
                  <Route path="settings/visual" element={<VisualIdentityAdmin />} />

                  <Route path="settings/media" element={<MediaSettingsAdmin />} />
                  <Route path="insights" element={<ContentInsightsAdmin />} />
                  <Route path="testimonials" element={<TestimonialsAdmin />} />
                  <Route path="marketing" element={<MarketingAdmin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </TooltipProvider>
        </AdminModeProvider>
      </SettingsProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
