import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug, getPostImageUrl, type PostRecord } from '@/services/posts'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { SEO } from '@/components/SEO'

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug)
        .then(setPost)
        .catch(() => setPost(null))
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading)
    return <div className="min-h-screen pt-24 pb-12 flex justify-center">Carregando...</div>

  if (!post)
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Post não encontrado</h1>
        <Button asChild variant="outline">
          <Link to="/blog">Voltar para o Blog</Link>
        </Button>
      </div>
    )

  const whatsappMessage = encodeURIComponent(
    `Olá Naturística, vim pelo blog e gostaria de agendar uma consulta.`,
  )
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`

  return (
    <div className="bg-[#fdf6ee] min-h-screen pb-20">
      <SEO
        title={post.seo_title || `${post.title} | Blog Naturística`}
        description={post.seo_description}
      />

      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[300px] w-full bg-black">
        <img
          src={getPostImageUrl(post)}
          alt={post.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fdf6ee] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto translate-y-8">
          <ScrollReveal>
            <Link
              to="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-6 font-medium transition-colors bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge className="bg-[#455e38] hover:bg-[#455e38]/90 text-white border-none shadow-sm px-3 py-1">
                  {post.category}
                </Badge>
              )}
              <span className="text-gray-600 text-sm font-medium">
                {new Date(post.created).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 leading-tight">
              {post.title}
            </h1>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 space-y-12">
        {/* Content */}
        <ScrollReveal delay={100}>
          <div
            className="prose prose-lg prose-green max-w-none prose-headings:font-serif prose-headings:text-[#455e38] prose-a:text-[#455e38]"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </ScrollReveal>

        {/* WhatsApp CTA */}
        <ScrollReveal delay={200}>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#455e38]/10 text-center space-y-6 mt-16">
            <h3 className="text-2xl font-bold font-serif text-[#455e38]">
              Pronto para transformar sua saúde?
            </h3>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Nossa equipe multidisciplinar está pronta para te atender com uma abordagem
              integrativa e humanizada.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#455e38] hover:bg-[#455e38]/90 text-white rounded-full px-8 h-14 text-lg"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Consulta via WhatsApp
              </a>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
