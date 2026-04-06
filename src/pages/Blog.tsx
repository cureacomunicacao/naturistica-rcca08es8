import { useState } from 'react'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

const categories = [
  'ANSIEDADE',
  'INSÔNIA',
  'BURNOUT',
  'DOR CRÔNICA',
  'TRAUMA',
  'TDAH',
  'ENXAQUECA',
  'HISTÓRIA DA PLANTA',
  'ENTEÓGENOS',
  'AYURVEDA',
  'PSICOTERAPIA',
  'ABUSO DE SUBSTÂNCIAS',
  'ESTRESSE',
]

const mockPosts = [
  {
    id: 1,
    title: 'Como a Ayurveda enxerga a Ansiedade Crônica',
    category: 'AYURVEDA',
    excerpt:
      'Descubra como os doshas influenciam seus picos de ansiedade e métodos naturais para aterramento e calma.',
    image: 'https://img.usecurling.com/p/400/300?q=tea%20herbs&color=green',
    date: '12 Out 2023',
  },
  {
    id: 2,
    title: 'Cannabis Medicinal no tratamento da Insônia',
    category: 'INSÔNIA',
    excerpt:
      'Um guia baseado em evidências sobre como os canabinoides interagem com o ciclo do sono e promovem descanso profundo.',
    image: 'https://img.usecurling.com/p/400/300?q=sleeping&color=green',
    date: '05 Nov 2023',
  },
  {
    id: 3,
    title: 'A diferença entre Cansaço e Burnout',
    category: 'BURNOUT',
    excerpt:
      'Aprenda a identificar os sinais de esgotamento do sistema nervoso central e quando é a hora de procurar ajuda médica.',
    image: 'https://img.usecurling.com/p/400/300?q=tired%20work&color=green',
    date: '20 Nov 2023',
  },
  {
    id: 4,
    title: 'O papel da Psicoterapia na integração de Enteógenos',
    category: 'ENTEÓGENOS',
    excerpt:
      'Por que a experiência isolada não basta? A importância do acompanhamento psicológico para mudanças reais de comportamento.',
    image: 'https://img.usecurling.com/p/400/300?q=forest%20mind&color=green',
    date: '02 Dez 2023',
  },
  {
    id: 5,
    title: 'TDAH em adultos: Abordagens Integrativas',
    category: 'TDAH',
    excerpt:
      'Além da medicação tradicional: como dieta, rotina e fitoterapia podem apoiar o cérebro neurodivergente.',
    image: 'https://img.usecurling.com/p/400/300?q=brain%20focus&color=green',
    date: '15 Dez 2023',
  },
  {
    id: 6,
    title: 'História da Planta: Resgatando a Sabedoria Ancestral',
    category: 'HISTÓRIA DA PLANTA',
    excerpt:
      'Um passeio pela história do uso medicinal de plantas e como a ciência moderna está validando esses conhecimentos milenares.',
    image: 'https://img.usecurling.com/p/400/300?q=ancient%20book%20plants&color=green',
    date: '10 Jan 2024',
  },
]

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = mockPosts.filter((post) => {
    const matchesCategory = activeCategory ? post.category === activeCategory : true
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container py-12 md:py-20">
      <ScrollReveal className="space-y-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Blog Naturistica</h1>
        <p className="text-xl text-muted-foreground font-serif">
          Artigos, reflexões e ciência sobre saúde integrativa.
        </p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="search"
            placeholder="Buscar artigos..."
            className="pl-10 h-12 rounded-full bg-white border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100} className="mb-12">
        <div className="flex flex-wrap justify-center gap-2">
          <Badge
            variant={activeCategory === null ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/90 hover:text-white rounded-full px-4 py-1.5 transition-colors"
            onClick={() => setActiveCategory(null)}
          >
            TODOS
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/90 hover:text-white rounded-full px-4 py-1.5 transition-colors bg-white"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 50}>
              <Card className="h-full overflow-hidden bg-white border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col rounded-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-primary hover:bg-white border-none font-semibold">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-3">{post.date}</p>
                  <h3 className="text-xl font-bold mb-3 font-serif line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-1 mt-auto">
                    Ler mais{' '}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            Nenhum artigo encontrado para sua busca.
          </div>
        )}
      </div>
    </div>
  )
}
