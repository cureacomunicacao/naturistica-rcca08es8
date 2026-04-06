import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'

export default function TratamentoDetalhe() {
  const { slug } = useParams()
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
          alt={treatment.title}
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
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif">
            {treatment.title}
          </h1>
        </div>
      </section>

      <div className="container max-w-4xl mt-16">
        <ScrollReveal className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border">
          <div
            className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary font-sans leading-relaxed"
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
            <Button
              size="lg"
              className="rounded-full h-14 px-8 bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Agendar consulta via WhatsApp
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
