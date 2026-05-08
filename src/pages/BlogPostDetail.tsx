import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getPostBySlug,
  getPostImageUrl,
  getPostImages,
  getPostGalleryImageUrl,
  type PostRecord,
  type PostImageRecord,
} from '@/services/posts'
import { ScrollReveal } from '@/components/ScrollReveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { AnxietyQuiz } from '@/components/AnxietyQuiz'
import { DepressionQuiz } from '@/components/DepressionQuiz'
import { ScheduleDialog } from '@/components/ScheduleDialog'
import { useSettings } from '@/hooks/use-settings'

export default function BlogPostDetail() {
  const { settings } = useSettings()
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [postImages, setPostImages] = useState<PostImageRecord[]>([])

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug)
        .then((data) => {
          setPost(data)
          getPostImages(data.id).then(setPostImages).catch(console.error)
        })
        .catch(() => setPost(null))
        .finally(() => setLoading(false))
    }
  }, [slug])

  const parsedContent = useMemo(() => {
    if (!post?.content) return ''
    let html = post.content
    postImages.forEach((img) => {
      const marker = `[image-${img.sort_order}]`
      const imgHtml = `<figure class="my-8"><img src="${getPostGalleryImageUrl(img)}" alt="${img.alt_text || ''}" class="w-full h-auto object-cover object-top rounded-xl shadow-md" /></figure>`
      html = html.replace(new RegExp(`<p>\\s*\\[image-${img.sort_order}\\]\\s*</p>`, 'g'), imgHtml)
      html = html.split(marker).join(imgHtml)
    })
    return html
  }, [post?.content, postImages])

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
          alt={post.image_alt || post.title}
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
              {(post.expand?.category_ref?.name || post.category) && (
                <Badge className="bg-[#455e38] hover:bg-[#455e38]/90 text-white border-none shadow-sm px-3 py-1">
                  {post.expand?.category_ref?.name || post.category}
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
            <h1
              className="text-3xl md:text-5xl font-bold font-serif text-gray-900 leading-tight max-w-full text-balance"
              style={{
                fontSize: settings.blog_h1_size?.value
                  ? `${settings.blog_h1_size.value}px`
                  : undefined,
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </h1>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-24 space-y-12">
        {/* Content */}
        <ScrollReveal delay={100}>
          <style>
            {`
              .dynamic-blog-content {
                font-family: ${settings.typography_blog_font_family?.value || 'inherit'} !important;
              }
              .dynamic-blog-content p, .dynamic-blog-content li {
                font-size: ${settings.blog_body_size?.value ? `${settings.blog_body_size.value}px` : 'inherit'} !important;
                line-height: 1.6 !important;
              }
              .dynamic-blog-content h1 { 
                font-size: ${settings.blog_h1_size?.value ? `${settings.blog_h1_size.value}px` : '2.5rem'} !important;
                line-height: 1.2 !important;
                text-wrap: balance !important;
              }
              .dynamic-blog-content h2 { 
                font-size: ${settings.blog_h2_size?.value ? `${settings.blog_h2_size.value}px` : '2rem'} !important;
                line-height: 1.3 !important;
              }
              .dynamic-blog-content h3 { 
                font-size: ${settings.blog_h3_size?.value ? `${settings.blog_h3_size.value}px` : '1.75rem'} !important;
                line-height: 1.4 !important;
              }
            `}
          </style>
          <div
            className="dynamic-blog-content prose prose-lg md:prose-xl prose-green max-w-none prose-headings:font-serif prose-headings:text-[#455e38] prose-p:text-gray-700 prose-a:text-[#455e38] hover:prose-a:text-[#455e38]/80 prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-700 leading-relaxed tracking-normal"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        </ScrollReveal>

        {post.slug === 'teste-de-ansiedade' && (
          <ScrollReveal delay={150}>
            <AnxietyQuiz />
          </ScrollReveal>
        )}

        {post.slug === 'teste-depressao-gratuito' && (
          <ScrollReveal delay={150}>
            <DepressionQuiz />
          </ScrollReveal>
        )}

        {post.slug === 'ansiedade-como-tratar' && (
          <ScrollReveal delay={150}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-8">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#455e38] text-[#455e38] hover:bg-[#455e38]/10 rounded-full h-14 px-8 text-lg w-full sm:w-auto font-medium"
              >
                <Link to="/tratamentos">Conhecer Tratamentos da Naturística</Link>
              </Button>
            </div>
          </ScrollReveal>
        )}

        {/* WhatsApp CTA */}
        {post.slug !== 'teste-depressao-gratuito' && (
          <ScrollReveal delay={200}>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#455e38]/10 text-center space-y-6 mt-16 transition-all hover:shadow-md">
              <h3 className="text-2xl font-bold font-serif text-[#455e38]">
                {post.slug === 'sintomas-ansiedade-grave'
                  ? 'Precisa de ajuda urgente?'
                  : 'Pronto para transformar sua saúde?'}
              </h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {post.slug === 'sintomas-ansiedade-grave'
                  ? 'Nossa equipe multidisciplinar está pronta para oferecer suporte imediato e um plano de tratamento eficaz.'
                  : 'Nossa equipe multidisciplinar está pronta para te atender com uma abordagem integrativa e humanizada.'}
              </p>
              <ScheduleDialog>
                <Button
                  size="lg"
                  className="bg-[#455e38] hover:bg-[#455e38]/90 text-white rounded-full px-8 h-14 text-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Agendar Consulta via WhatsApp
                </Button>
              </ScheduleDialog>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
