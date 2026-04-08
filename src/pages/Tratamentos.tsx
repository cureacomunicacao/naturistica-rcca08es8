import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Leaf, Quote } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useSettings } from '@/hooks/use-settings'

export default function Tratamentos() {
  const [treatments, setTreatments] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const { settings } = useSettings()

  useEffect(() => {
    pb.collection('treatments')
      .getFullList({ sort: 'title' })
      .then(setTreatments)
      .catch(console.error)
    pb.collection('testimonials')
      .getFullList({ filter: 'active = true', sort: '-created' })
      .then(setTestimonials)
      .catch(console.error)
  }, [])

  const approachTitle = settings.treatments_approach_title?.value || 'Nossa Abordagem Clínica'
  const approachContent =
    settings.treatments_approach_content?.value ||
    '<p>Na Naturistica, enxergamos cada paciente de forma única. Nossa abordagem une o melhor da medicina baseada em evidências com práticas integrativas, focando na raiz do problema para promover uma cura verdadeira e duradoura.</p><p>Trabalhamos com um plano de cuidado personalizado, escuta ativa e acolhimento.</p>'
  const approachImage = settings.treatments_approach_image?.image
    ? pb.files.getURL(settings.treatments_approach_image, settings.treatments_approach_image.image)
    : 'https://img.usecurling.com/p/800/600?q=doctors%20consultation&color=green'

  return (
    <div className="pb-24">
      <SEO
        title={
          settings.treatments_seo_title?.value ||
          settings.treatments_meta_title?.value ||
          'Tratamentos | Naturistica'
        }
        description={
          settings.treatments_seo_description?.value ||
          settings.treatments_meta_description?.value ||
          'Conheça nossos tratamentos integrativos para ansiedade, insônia, burnout e mais.'
        }
      />

      {/* Hero Banner */}
      {settings.treatments_banner_image?.image ? (
        <ScrollReveal className="relative h-[40vh] min-h-[350px] mb-16 overflow-hidden">
          <img
            src={pb.files.getURL(
              settings.treatments_banner_image,
              settings.treatments_banner_image.image,
            )}
            alt={settings.treatments_banner_image.image_alt || 'Tratamentos'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
              Tratamentos Integrativos
            </h1>
            <p className="text-xl md:text-2xl font-serif italic max-w-2xl mx-auto opacity-90">
              "Tratamos a causa, não apenas os sintomas."
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <div className="container py-16 text-center space-y-6">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold text-primary font-serif">
              Tratamentos Integrativos
            </h1>
            <p className="text-xl text-muted-foreground font-serif italic max-w-2xl mx-auto mt-4">
              "Tratamos a causa, não apenas os sintomas."
            </p>
          </ScrollReveal>
        </div>
      )}

      {/* Approach Section */}
      <div className="container max-w-6xl mb-24">
        <ScrollReveal className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden">
          <div className="grid md:grid-cols-2 items-stretch">
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-6">
                {approachTitle}
              </h2>
              <div
                className="prose prose-lg text-muted-foreground leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: approachContent }}
              />
            </div>
            <div className="relative h-[300px] md:h-full bg-muted">
              <img
                src={approachImage}
                alt="Nossa Abordagem"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Treatments Grid */}
      <div className="container max-w-6xl mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-foreground">Áreas de Atuação</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treatments.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 50}>
              <Link to={`/tratamentos/${t.slug}`} className="block h-full group">
                <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col">
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
                  <CardContent className="p-6 flex flex-col flex-1 items-start">
                    <h3 className="text-2xl font-bold font-serif mb-3 text-foreground group-hover:text-primary transition-colors">
                      {t.title}
                    </h3>
                    <div
                      className="text-muted-foreground line-clamp-3 mb-6 text-sm prose prose-sm"
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

      {/* Testimonials / Social Proof */}
      {testimonials.length > 0 && (
        <div className="bg-primary/5 py-24">
          <div className="container max-w-6xl">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-4">
                Histórias de Transformação
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Relatos de pacientes que reencontraram o equilíbrio e bem-estar através do cuidado
                integrativo.
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((test, i) => (
                <ScrollReveal key={test.id} delay={i * 100}>
                  <Card className="h-full bg-white border-none shadow-sm rounded-2xl relative pt-8">
                    <div className="absolute top-4 left-6 text-primary/20">
                      <Quote className="w-10 h-10 rotate-180" />
                    </div>
                    <CardContent className="px-6 pb-6 pt-4 flex flex-col h-full relative z-10">
                      <div className="flex-1 text-muted-foreground italic mb-6 leading-relaxed">
                        "{test.content}"
                      </div>
                      <div className="flex items-center gap-4 mt-auto">
                        {test.image ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={pb.files.getURL(test, test.image)}
                              alt={test.patient_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                            {test.patient_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-foreground">{test.patient_name}</div>
                          {test.doctor && (
                            <div className="text-xs text-muted-foreground">
                              Paciente do Dr(a). {test.doctor}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
