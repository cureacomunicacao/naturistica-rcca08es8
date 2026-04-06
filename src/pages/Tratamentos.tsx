import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Leaf } from 'lucide-react'
import { SEO } from '@/components/SEO'

export default function Tratamentos() {
  const [treatments, setTreatments] = useState<any[]>([])

  useEffect(() => {
    pb.collection('treatments').getFullList({ sort: 'title' }).then(setTreatments)
  }, [])

  return (
    <div className="container py-12 md:py-20">
      <SEO
        title="Tratamentos | Naturistica"
        description="Conheça nossos tratamentos integrativos para ansiedade, insônia, burnout e mais."
      />

      <ScrollReveal className="text-center mb-16 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Tratamentos Integrativos</h1>
        <p className="text-xl text-primary font-serif italic max-w-2xl mx-auto">
          "Tratamos a causa, não apenas os sintomas."
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {treatments.map((t, i) => (
          <ScrollReveal key={t.id} delay={i * 50}>
            <Link to={`/tratamentos/${t.slug}`} className="block h-full group">
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                <div className="h-48 bg-primary/5 flex items-center justify-center relative overflow-hidden">
                  {t.image ? (
                    <img
                      src={pb.files.getURL(t, t.image)}
                      alt={t.title}
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
