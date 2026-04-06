import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Leaf } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useSettings } from '@/hooks/use-settings'

export default function Tratamentos() {
  const [treatments, setTreatments] = useState<any[]>([])
  const { settings } = useSettings()

  useEffect(() => {
    pb.collection('treatments').getFullList({ sort: 'title' }).then(setTreatments)
  }, [])

  return (
    <div className="container py-12 md:py-20">
      <SEO
        title={settings.treatments_seo_title?.value || 'Tratamentos | Naturistica'}
        description={
          settings.treatments_seo_description?.value ||
          'Conheça nossos tratamentos integrativos para ansiedade, insônia, burnout e mais.'
        }
      />

      {settings.treatments_banner_image?.image && (
        <ScrollReveal className="mb-12 rounded-3xl overflow-hidden h-[300px] relative">
          <img
            src={pb.files.getURL(
              settings.treatments_banner_image,
              settings.treatments_banner_image.image,
            )}
            alt={settings.treatments_banner_image.image_alt || 'Banner de Tratamentos'}
            title={settings.treatments_banner_image.value || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tratamentos Integrativos</h1>
            <p className="text-xl font-serif italic max-w-2xl mx-auto opacity-90">
              "Tratamos a causa, não apenas os sintomas."
            </p>
          </div>
        </ScrollReveal>
      )}

      {!settings.treatments_banner_image?.image && (
        <ScrollReveal className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Tratamentos Integrativos
          </h1>
          <p className="text-xl text-primary font-serif italic max-w-2xl mx-auto">
            "Tratamos a causa, não apenas os sintomas."
          </p>
        </ScrollReveal>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {treatments.map((t, i) => (
          <ScrollReveal key={t.id} delay={i * 50}>
            <Link to={`/tratamentos/${t.slug}`} className="block h-full group">
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <div className="h-48 bg-primary/5 flex items-center justify-center relative overflow-hidden">
                  {t.image ? (
                    <img
                      src={pb.files.getURL(t, t.image)}
                      alt={t.image_alt || t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Leaf className="w-16 h-16 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <CardContent className="p-6 flex flex-col items-start">
                  <h3 className="text-2xl font-bold font-serif mb-3 text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  <div
                    className="text-muted-foreground line-clamp-3 mb-6 text-sm"
                    dangerouslySetInnerHTML={{ __html: t.content }}
                  />
                  <div className="mt-auto flex items-center text-primary font-semibold text-sm uppercase tracking-wider">
                    Saber mais{' '}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
