import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ScrollReveal } from '@/components/ScrollReveal'
import {
  ArrowRight,
  Brain,
  Heart,
  Moon,
  Sparkles,
  Sprout,
  Wind,
  Activity,
  Flame,
  Puzzle,
} from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPosts, type PostRecord, getPostImageUrl } from '@/services/posts'

const iconMap: Record<string, any> = {
  ansiedade: Wind,
  insonia: Moon,
  burnout: Heart,
  tdah: Brain,
  trauma: Sparkles,
  enxaqueca: Sprout,
  'dor-cronica': Flame,
  autismo: Puzzle,
}

const testimonialsFelipe = [
  {
    name: 'Mariana F. Torres',
    text: 'Encontrei no Dr. Felipe um acolhimento raro. O tratamento integrado mudou minha forma de lidar com o estresse do dia a dia.',
  },
  {
    name: 'Jhulia A. Silva',
    text: 'A visão ancestral combinada com a medicina moderna me trouxe uma clareza que eu buscava há anos na terapia convencional.',
  },
  {
    name: 'Rafael M. Jotta',
    text: 'Profissionalismo e empatia. O acompanhamento contínuo fez toda a diferença na minha recuperação do burnout.',
  },
]

const testimonialsBeatriz = [
  {
    name: 'Lavinia Moreira',
    text: 'A Dra. Beatriz tem uma escuta atenta e profunda. Senti que finalmente fui compreendida em minhas questões de insônia crônica.',
  },
  {
    name: 'Fernanda Garmatter',
    text: 'O tratamento com cannabis medicinal conduzido de forma tão ética me devolveu a qualidade de vida. Gratidão imensa.',
  },
  {
    name: 'Luiz Carlos Bassetto',
    text: 'Uma abordagem que respeita o tempo do paciente. A integração com Ayurveda foi um divisor de águas na minha saúde.',
  },
]

function ImageWithFallback({ src, fallback, alt, ...props }: any) {
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
    setError(false)
  }, [src])

  return (
    <img
      src={error ? fallback : currentSrc}
      alt={alt}
      onError={() => {
        if (!error) {
          setError(true)
          setCurrentSrc(fallback)
        }
      }}
      {...props}
    />
  )
}

export default function Index() {
  const { settings } = useSettings()
  const [treatments, setTreatments] = useState<any[]>([])
  const [posts, setPosts] = useState<PostRecord[]>([])
  const [testimonialsFelipeDb, setTestimonialsFelipeDb] = useState<any[]>([])
  const [testimonialsBeatrizDb, setTestimonialsBeatrizDb] = useState<any[]>([])
  const [featuredTreatment, setFeaturedTreatment] = useState<any>(null)

  useEffect(() => {
    pb.collection('treatments')
      .getFullList({ sort: 'created' })
      .then(setTreatments)
      .catch((err) => {
        console.warn('Failed to load treatments:', err.message)
      })

    getPosts('status = "published"')
      .then((res) => setPosts(res.slice(0, 3)))
      .catch((err) => {
        console.warn('Failed to load posts:', err.message)
      })

    pb.collection('testimonials')
      .getFullList({ filter: 'active = true && doctor = "Felipe"' })
      .then(setTestimonialsFelipeDb)
      .catch((err) => {
        console.warn('Failed to fetch testimonials Felipe:', err.message)
      })

    pb.collection('testimonials')
      .getFullList({ filter: 'active = true && doctor = "Beatriz"' })
      .then(setTestimonialsBeatrizDb)
      .catch((err) => {
        console.warn('Failed to fetch testimonials Beatriz:', err.message)
      })
  }, [])

  useEffect(() => {
    const featuredId = settings.home_featured_treatment?.value
    if (featuredId) {
      pb.collection('treatments')
        .getOne(featuredId)
        .then(setFeaturedTreatment)
        .catch((err) => {
          console.warn(`Featured treatment ID ${featuredId} not found. Skipping.`, err.message)
        })
    } else {
      setFeaturedTreatment(null)
    }
  }, [settings.home_featured_treatment])

  const heroImage = settings.home_hero?.image
    ? pb.files.getURL(settings.home_hero, settings.home_hero.image)
    : 'https://img.usecurling.com/p/800/1000?q=nature%20meditation&color=green'

  const heroAlt = settings.home_hero?.image_alt || 'Natureza e serenidade'

  const activeFelipeTestimonials =
    testimonialsFelipeDb.length > 0 ? testimonialsFelipeDb : testimonialsFelipe
  const activeBeatrizTestimonials =
    testimonialsBeatrizDb.length > 0 ? testimonialsBeatrizDb : testimonialsBeatriz

  const expTitle =
    settings.expectations_title?.value || 'O que esperar da sua consulta e acompanhamento?'
  const expItemsRaw =
    settings.expectations_items?.value ||
    'Consultas longas (1h30 de duração) com escuta ativa e acolhimento.\nAtendimento 100% online (Telemedicina) no conforto da sua casa.\nPrescrições digitais seguras enviadas diretamente no seu WhatsApp.\nSuporte contínuo via WhatsApp para dúvidas e ajustes de tratamento.'
  const expItems = expItemsRaw.split('\n').filter(Boolean)
  const expBtnText = settings.expectations_button_text?.value || 'Agendar consulta online'
  const expImgAlt = settings.expectations_image_alt?.value || 'Consulta Online'
  const expImage = settings.expectations_image?.image
    ? pb.files.getURL(settings.expectations_image, settings.expectations_image.image)
    : 'https://img.usecurling.com/p/600/800?q=online%20consultation%20laptop&color=green'

  return (
    <div className="flex flex-col gap-24 md:gap-32">
      <SEO
        title={settings.home_seo_title?.value || 'Saúde & Consciência | Naturistica'}
        description={
          settings.home_seo_description?.value ||
          'Naturistica: onde a ciência encontra a ancestralidade para saúde e consciência.'
        }
      />
      {/* Hero Section */}
      <section className="container pt-12 md:pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
                Saúde & <br />
                <span className="text-primary/80 italic">Consciência</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-serif text-balance">
                quando a ciência encontra a ancestralidade.
              </p>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">
              Somos uma clínica médica dedicada a resgatar o equilíbrio natural do seu corpo e mente
              através de práticas integrativas, cannabis medicinal e psicoterapia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full text-base h-14 px-8 group">
                <a href={settings.home_hero_btn1_link?.value || '#'}>
                  {settings.home_hero_btn1_text?.value || 'Agendar consulta online'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full text-base h-14 px-8"
              >
                <Link to={settings.home_hero_btn2_link?.value || '/sobre'}>
                  {settings.home_hero_btn2_text?.value || 'Conheça nossa história'}
                </Link>
              </Button>
            </div>
          </ScrollReveal>
          <ScrollReveal
            delay={200}
            className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden"
          >
            <ImageWithFallback
              src={heroImage}
              fallback="https://img.usecurling.com/p/800/1000?q=nature%20meditation&color=green"
              alt={heroAlt}
              title={settings.home_hero?.value || ''}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Treatment Section */}
      {featuredTreatment && (
        <section className="container py-12">
          <ScrollReveal>
            <Card className="bg-primary/5 border-none shadow-sm overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                <div className="space-y-6">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary hover:bg-primary/10 border-none"
                  >
                    Tratamento em Destaque
                  </Badge>
                  <h2 className="text-3xl font-bold">{featuredTreatment.title}</h2>
                  {featuredTreatment.seo_description && (
                    <p className="text-muted-foreground text-lg">
                      {featuredTreatment.seo_description}
                    </p>
                  )}
                  <Button asChild className="rounded-full">
                    <Link to={`/tratamentos/${featuredTreatment.slug}`}>Saiba mais</Link>
                  </Button>
                </div>
                {featuredTreatment.image && (
                  <div className="relative h-[300px] rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src={pb.files.getURL(featuredTreatment, featuredTreatment.image)}
                      fallback={`https://img.usecurling.com/p/600/400?q=${encodeURIComponent(featuredTreatment.title)}&color=green`}
                      alt={featuredTreatment.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>
          </ScrollReveal>
        </section>
      )}

      {/* Treatments Section */}
      <section className="bg-white/50 py-24 overflow-hidden">
        <div className="container mb-16">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center">Tratamento de:</h2>
          </ScrollReveal>
        </div>

        {treatments.length > 0 && (
          <div className="flex overflow-hidden group w-full">
            <div className="flex shrink-0 items-center gap-6 px-3 animate-marquee group-hover:[animation-play-state:paused]">
              {treatments.map((t) => {
                const Icon = iconMap[t.slug] || Activity
                return (
                  <Link key={t.id} to={`/tratamentos/${t.slug}`} className="w-48 shrink-0">
                    <Card className="bg-transparent border-none shadow-none text-center group/card cursor-pointer hover:bg-white/80 transition-colors rounded-2xl h-full">
                      <CardContent className="p-6 flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors">
                          <Icon className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <span className="font-medium text-lg text-balance">{t.title}</span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
            <div
              className="flex shrink-0 items-center gap-6 px-3 animate-marquee group-hover:[animation-play-state:paused]"
              aria-hidden="true"
            >
              {treatments.map((t) => {
                const Icon = iconMap[t.slug] || Activity
                return (
                  <Link key={`${t.id}-dup`} to={`/tratamentos/${t.slug}`} className="w-48 shrink-0">
                    <Card className="bg-transparent border-none shadow-none text-center group/card cursor-pointer hover:bg-white/80 transition-colors rounded-2xl h-full">
                      <CardContent className="p-6 flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors">
                          <Icon className="w-8 h-8 stroke-[1.5]" />
                        </div>
                        <span className="font-medium text-lg text-balance">{t.title}</span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Philosophy Section */}
      <section className="container">
        <ScrollReveal className="max-w-4xl mx-auto text-center space-y-8">
          <h2
            className="text-3xl md:text-5xl font-bold text-balance mb-12"
            dangerouslySetInnerHTML={{
              __html:
                settings.home_philosophy_title?.value ||
                'A saúde em que acreditamos: <br /><span class="italic font-normal text-primary">retorno ao o que você já é</span>',
            }}
          />
          <div
            className="space-y-6 text-lg md:text-xl leading-relaxed text-muted-foreground text-left md:text-center"
            dangerouslySetInnerHTML={{
              __html:
                settings.home_philosophy_text?.value ||
                '<p>Acreditamos que a verdadeira saúde não é a ausência de doenças, mas um estado de profundo alinhamento entre corpo, mente e natureza. Nossa abordagem rompe com a visão fragmentada da medicina tradicional.</p><p>Ao unir os conhecimentos milenares da Ayurveda e do uso ritualístico de plantas professoras com o rigor da ciência moderna, buscamos ir à raiz do seu sofrimento.</p><p>O fim da separação mente-corpo é o início da sua cura. Nós guiamos você nesse caminho de volta para casa, para a sua essência mais pura e equilibrada.</p>',
            }}
          />
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-24 overflow-hidden">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              {settings.home_testimonials_title?.value ||
                'Conheça histórias de alguns de nossos pacientes'}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Dr. Felipe */}
            <ScrollReveal delay={100} className="space-y-6">
              <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-4">
                Pacientes Dr. Felipe Zamboni
              </h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {activeFelipeTestimonials.map((t, i) => (
                    <CarouselItem key={i}>
                      <Card className="bg-background border-none shadow-sm h-full">
                        <CardContent className="p-8 space-y-4 flex flex-col h-full justify-between">
                          <p className="text-muted-foreground italic text-lg leading-relaxed">
                            "{t.text || t.content}"
                          </p>
                          <div className="flex items-center gap-4 mt-4">
                            {t.image && t.collectionId && t.id ? (
                              <ImageWithFallback
                                src={pb.files.getURL(t, t.image)}
                                fallback="https://img.usecurling.com/ppl/thumbnail"
                                alt={t.patient_name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : null}
                            <p className="font-semibold">{t.name || t.patient_name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="relative inset-auto translate-y-0" />
                  <CarouselNext className="relative inset-auto translate-y-0" />
                </div>
              </Carousel>
            </ScrollReveal>

            {/* Dra. Beatriz */}
            <ScrollReveal delay={200} className="space-y-6">
              <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-4">
                Pacientes Dra. Beatriz Mulari
              </h3>
              <Carousel className="w-full">
                <CarouselContent>
                  {activeBeatrizTestimonials.map((t, i) => (
                    <CarouselItem key={i}>
                      <Card className="bg-background border-none shadow-sm h-full">
                        <CardContent className="p-8 space-y-4 flex flex-col h-full justify-between">
                          <p className="text-muted-foreground italic text-lg leading-relaxed">
                            "{t.text || t.content}"
                          </p>
                          <div className="flex items-center gap-4 mt-4">
                            {t.image && t.collectionId && t.id ? (
                              <ImageWithFallback
                                src={pb.files.getURL(t, t.image)}
                                fallback="https://img.usecurling.com/ppl/thumbnail"
                                alt={t.patient_name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : null}
                            <p className="font-semibold">{t.name || t.patient_name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="relative inset-auto translate-y-0" />
                  <CarouselNext className="relative inset-auto translate-y-0" />
                </div>
              </Carousel>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {posts.length > 0 && (
        <section className="container py-24">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {settings.home_blog_title?.value || 'Nosso Blog'}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {settings.home_blog_desc?.value ||
                    'Artigos, reflexões e informações sobre saúde integrativa e terapias naturais.'}
                </p>
              </div>
              <Button variant="outline" asChild className="rounded-full">
                <Link to={settings.home_blog_btn_link?.value || '/blog'}>
                  {settings.home_blog_btn_text?.value || 'Ver todos os artigos'}
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <Card className="h-full bg-background border-none shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={getPostImageUrl(post)}
                        fallback={`https://img.usecurling.com/p/600/400?q=${encodeURIComponent(post.title)}&color=green`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      {post.category && (
                        <Badge
                          variant="secondary"
                          className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {post.category}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.seo_description && (
                        <p className="text-muted-foreground line-clamp-3 mt-auto">
                          {post.seo_description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Consultation Info */}
      <section className="container pb-24">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-border/50 max-w-5xl mx-auto">
          <ScrollReveal className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">{expTitle}</h2>
              <ul className="space-y-4 text-muted-foreground">
                {expItems.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                      ✓
                    </div>
                    <p>{item.trim()}</p>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 mt-4">
                <a href={settings.expectations_button_link?.value || '#'}>{expBtnText}</a>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden hidden md:block">
              <ImageWithFallback
                src={expImage}
                fallback="https://img.usecurling.com/p/600/800?q=doctor&color=green"
                alt={expImgAlt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
