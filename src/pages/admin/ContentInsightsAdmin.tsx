import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import pb from '@/lib/pocketbase/client'
import { BarChart, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ContentStat {
  id: string
  title: string
  type: string
  wordCount: number
  keywords: string
}

function analyzeText(text: string) {
  const cleanText = (text || '').replace(/<[^>]*>?/gm, ' ').toLowerCase()
  const words = cleanText.match(/\b([a-záéíóúãõâêîôûç]{4,})\b/g) || []

  const stopwords = [
    'para',
    'como',
    'mais',
    'isso',
    'pode',
    'esse',
    'essa',
    'este',
    'esta',
    'seja',
    'pelo',
    'pela',
    'sobre',
    'ainda',
    'muito',
    'quando',
    'onde',
    'qual',
    'quem',
    'aqui',
    'você',
    'mesmo',
    'está',
    'são',
    'também',
    'sua',
    'seu',
    'nas',
    'nos',
    'dos',
    'das',
    'com',
    'que',
    'não',
    'uma',
    'tem',
    'aos',
  ]

  const filtered = words.filter((w) => !stopwords.includes(w) && isNaN(Number(w)))
  const counts: Record<string, number> = {}
  filtered.forEach((w) => (counts[w] = (counts[w] || 0) + 1))

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    wordCount: cleanText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length,
    keywords: sorted.map((s) => `${s[0]} (${s[1]})`).join(', '),
  }
}

const staticPages = [
  {
    id: 'home',
    title: 'Início',
    type: 'Página',
    content:
      'Naturistica Onde a ciência encontra a ancestralidade para saúde e consciência. Tratamento médico humanizado e integrativo. Especialistas em saúde integrativa e cannabis medicinal para dor cronica.',
  },
  {
    id: 'sobre',
    title: 'Sobre',
    type: 'Página',
    content:
      'Nossa missão é integrar o conhecimento ancestral com as descobertas científicas modernas. Acreditamos que a saúde plena envolve o equilíbrio físico, mental e espiritual. Atendimento humanizado e focado no paciente. Cannabis Medicinal tratamentos inovadores.',
  },
]

export default function ContentInsightsAdmin() {
  const [stats, setStats] = useState<ContentStat[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadStats() {
      try {
        const posts = await pb.collection('posts').getFullList()
        const treatments = await pb.collection('treatments').getFullList()

        const allContent: ContentStat[] = [
          ...staticPages.map((p) => {
            const analysis = analyzeText(p.content)
            return {
              id: p.id,
              title: p.title,
              type: p.type,
              wordCount: analysis.wordCount,
              keywords: analysis.keywords,
            }
          }),
          ...treatments.map((t) => {
            const analysis = analyzeText(t.content || t.title)
            return {
              id: t.id,
              title: t.title,
              type: 'Tratamento',
              wordCount: analysis.wordCount,
              keywords: analysis.keywords,
            }
          }),
          ...posts.map((p) => {
            const analysis = analyzeText(p.content || p.title)
            return {
              id: p.id,
              title: p.title,
              type: 'Blog Post',
              wordCount: analysis.wordCount,
              keywords: analysis.keywords,
            }
          }),
        ]

        setStats(allContent)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const filteredStats = stats.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-primary">Insights de Conteúdo</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Análise de SEO e Palavras-chave</CardTitle>
            <CardDescription>
              Monitore a densidade de termos e a extensão do conteúdo de todas as páginas.
            </CardDescription>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conteúdo..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Título do Conteúdo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Total de Palavras</TableHead>
                  <TableHead className="pl-8">Termos Mais Frequentes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Analisando conteúdos...
                    </TableCell>
                  </TableRow>
                ) : filteredStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum conteúdo encontrado para a busca.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStats.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                          {s.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {s.wordCount}
                      </TableCell>
                      <TableCell className="pl-8 text-sm text-muted-foreground">
                        {s.keywords || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
