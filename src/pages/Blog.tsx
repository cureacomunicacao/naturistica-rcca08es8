import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import {
  getPosts,
  getBlogCategories,
  getPostImageUrl,
  type PostRecord,
  type BlogCategoryRecord,
} from '@/services/posts'

export default function Blog() {
  const [posts, setPosts] = useState<PostRecord[]>([])
  const [dbCategories, setDbCategories] = useState<BlogCategoryRecord[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getPosts(`status="published" && published_at <= @now`).then(setPosts).catch(console.error)
    getBlogCategories().then(setDbCategories).catch(console.error)
  }, [])

  const categories = useMemo(() => {
    return dbCategories.sort((a, b) => a.name.localeCompare(b.name))
  }, [dbCategories])

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory ? post.category_ref === activeCategory : true
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === null
                ? 'shadow-sm'
                : 'bg-white text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            TODOS
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'shadow-sm'
                  : 'bg-white text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40'
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 50}>
              <Link to={`/blog/${post.slug}`}>
                <Card className="h-full overflow-hidden bg-white border-none shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col rounded-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getPostImageUrl(post)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {(post.expand?.category_ref?.name || post.category) && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white border-none font-semibold">
                          {post.expand?.category_ref?.name || post.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(post.created).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <h3 className="text-xl font-bold mb-3 font-serif line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                      {post.seo_description ||
                        post.content?.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...'}
                    </p>
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-1 mt-auto">
                      Ler mais{' '}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </CardContent>
                </Card>
              </Link>
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
