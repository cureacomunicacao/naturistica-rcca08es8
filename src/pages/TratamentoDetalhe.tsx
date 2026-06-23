import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'
import { ScheduleDialog } from '@/components/ScheduleDialog'
import { useSettings } from '@/hooks/use-settings'

export default function TratamentoDetalhe() {
  const { slug } = useParams()
  const { settings } = useSettings()
  const [treatment, setTreatment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    pb.collection('treatments')
      .getFirstListItem(`slug="${slug}"`)
      .then((res) => setTreatment(res))
      .catch(() => setTreatment(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading)
    return <div className="min-h-[50vh] flex items-center justify-center">Carregando...</div>
  if (!treatment) return <Navigate to="/tratamentos" replace />

  const imageUrl = treatment.image
    ? pb.files.getURL(treatment, treatment.image)
    : `https://img.usecurling.com/p/1200/800?q=${encodeURIComponent(treatment.title)}&color=green`

  return (
    <div className="pb-24">
      <SEO
        title={treatment.seo_title || `${treatment.title} | Naturistica`}
        description={treatment.seo_description}
      />

      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-primary/90">
        <img
          src={imageUrl}
          alt={treatment.image_alt || treatment.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute top-8 left-8 z-20">
          <Link
            to="/tratamentos"
            className="inline-flex items-center text-white hover:text-white/80 transition-colors bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Todos os Tratamentos
          </Link>
        </div>
        <div className="relative z-10 text-center space-y-4 px-4 w-full">
          <h1
            className="font-bold text-white font-serif whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-[2.5rem]"
            style={{
              fontSize: settings.treatment_h1_size?.value
                ? `${settings.treatment_h1_size.value}px`
                : undefined,
              lineHeight: 1.2,
            }}
          >
            {treatment.title}
          </h1>
        </div>
      </section>

      <div className="container max-w-4xl mt-16">
        <ScrollReveal className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border">
          <style>
            {`
              .dynamic-treatment-content {
                font-family: ${settings.typography_treatment_font_family?.value || 'var(--font-body)'} !important;
              }
              .dynamic-treatment-content h1,
              .dynamic-treatment-content h2,
              .dynamic-treatment-content h3,
              .dynamic-treatment-content h4,
              .dynamic-treatment-content h5,
              .dynamic-treatment-content h6 {
                font-family: var(--font-heading) !important;
              }
              .dynamic-treatment-content p, .dynamic-treatment-content li {
                font-size: ${settings.treatment_body_size?.value ? `${settings.treatment_body_size.value}px` : 'inherit'} !important;
                line-height: 1.6 !important;
              }
              .dynamic-treatment-content h1 { 
                font-size: ${settings.treatment_h1_size?.value ? `${settings.treatment_h1_size.value}px` : '2.5rem'} !important;
                line-height: 1.2 !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
              }
              .dynamic-treatment-content h2 { 
                font-size: ${settings.treatment_h2_size?.value ? `${settings.treatment_h2_size.value}px` : '2rem'} !important;
                line-height: 1.3 !important;
              }
              .dynamic-treatment-content h3 { 
                font-size: ${settings.treatment_h3_size?.value ? `${settings.treatment_h3_size.value}px` : '1.75rem'} !important;
                line-height: 1.4 !important;
              }
            `}
          </style>
          <div
            className="dynamic-treatment-content prose prose-lg md:prose-xl max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-headings:font-serif prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:text-muted-foreground font-sans leading-relaxed"
            dangerouslySetInnerHTML={{ __html: treatment.content }}
          />

          <div className="mt-12 pt-12 border-t text-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Pronto para dar o primeiro passo?
            </h3>
            <p className="text-muted-foreground text-lg">
              Agende uma avaliação detalhada e descubra como podemos ajudar no seu tratamento de{' '}
              {treatment.title.toLowerCase()}.
            </p>
            <ScheduleDialog>
              <Button
                size="lg"
                className="rounded-full h-auto py-3 px-8 text-center whitespace-normal break-words bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 text-base cursor-pointer inline-flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span>Agendar consulta via WhatsApp</span>
              </Button>
            </ScheduleDialog>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
