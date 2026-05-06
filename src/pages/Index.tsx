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
  Activity,
  Flame,
  Puzzle,
  Wind,
  Moon,
  Heart,
  Brain,
  Sparkles,
  Sprout,
} from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPosts, type PostRecord, getPostImageUrl } from '@/services/posts'
import { EditableText } from '@/components/EditableText'
import { useRealtime } from '@/hooks/use-realtime'
import { Skeleton } from '@/components/ui/skeleton'

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

function ImageWithFallback({ src, fallback, alt, className, title }: any) {
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
      title={title}
      className={className}
      onError={() => {
        if (!error) {
          setError(true)
          setCurrentSrc(fallback)
        }
      }}
    />
  )
}

export default function Index() {
  const { settings, loading: settingsLoading } = useSettings()
  const [treatments, setTreatments] = useState<any[]>([])
  const [loadingTreatments, setLoadingTreatments] = useState(true)
  const [posts, setPosts] = useState<PostRecord[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [testimonialsFelipeDb, setTestimonialsFelipeDb] = useState<any[]>([])
  const [testimonialsBeatrizDb, setTestimonialsBeatrizDb] = useState<any[]>([])
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)
  const [featuredTreatment, setFeaturedTreatment] = useState<any>(null)
  const [loadingFeaturedTreatment, setLoadingFeaturedTreatment] = useState(true)

  const fetchTestimonials = () => {
    setLoadingTestimonials(true)
    Promise.allSettled([
      pb
        .collection('testimonials')
        .getFullList({ filter: 'active = true && doctor = "Felipe"' })
        .then(setTestimonialsFelipeDb),
      pb
        .collection('testimonials')
        .getFullList({ filter: 'active = true && doctor = "Beatriz"' })
        .then(setTestimonialsBeatrizDb),
    ]).finally(() => setLoadingTestimonials(false))
  }

  useEffect(() => {
    pb.collection('treatments')
      .getFullList({ sort: 'created' })
      .then(setTreatments)
      .catch((err) => {
        console.warn('Failed to load treatments:', err.message)
      })
      .finally(() => setLoadingTreatments(false))

    getPosts('status = "published"')
      .then((res) => setPosts(res.slice(0, 3)))
      .catch((err) => {
        console.warn('Failed to load posts:', err.message)
      })
      .finally(() => setLoadingPosts(false))

    fetchTestimonials()
  }, [])

  useRealtime('testimonials', () => {
    fetchTestimonials()
  })

  useEffect(() => {
    if (settingsLoading) {
      setLoadingFeaturedTreatment(true)
      return
    }

    const featuredId = settings.home_featured_treatment?.value
    if (featuredId) {
      setLoadingFeaturedTreatment(true)
      pb.collection('treatments')
        .getOne(featuredId)
        .then(setFeaturedTreatment)
        .catch((err) => {
          console.warn(`Featured treatment ID ${featuredId} not found. Skipping.`, err.message)
          setFeaturedTreatment(null)
        })
        .finally(() => setLoadingFeaturedTreatment(false))
    } else {
      setFeaturedTreatment(null)
      setLoadingFeaturedTreatment(false)
    }
  }, [settings.home_featured_treatment, settingsLoading])

  const heroImage = settings.home_hero?.image
    ? pb.files.getURL(settings.home_hero, settings.home_hero.image)
    : 'https://img.usecurling.com/p/800/1000?q=nature%20meditation&color=green'

  const heroAlt = settings.home_hero?.image_alt || 'Natureza e serenidade'

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
    <div className="flex flex-col bg-white overflow-hidden text-foreground">
      <SEO
        title={settings.home_seo_title?.value || 'Saúde & Consciência | Naturistica'}
        description={
          settings.home_seo_description?.value ||
          'Naturistica: onde a ciência encontra a ancestralidade para saúde e consciência.'
        }
      />
      {/* Hero Section */}
      <section className="container relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] bg-primary/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl mix-blend-multiply" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] bg-secondary/40 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl mix-blend-multiply" />
        </div>

        {settingsLoading ? (
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-16 md:h-24 w-3/4 rounded-xl" />
                <Skeleton className="h-8 md:h-10 w-2/3 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-full max-w-lg rounded-md" />
                <Skeleton className="h-6 w-5/6 max-w-lg rounded-md" />
                <Skeleton className="h-6 w-4/6 max-w-lg rounded-md" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Skeleton className="h-14 w-full sm:w-64 rounded-full" />
                <Skeleton className="h-14 w-full sm:w-64 rounded-full" />
              </div>
            </div>
            <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] rotate-6 scale-105 transition-all duration-700" />
              <Skeleton className="relative z-10 w-[90%] h-[90%] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-xl" />
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <ScrollReveal className="space-y-8">
              <div className="space-y-4">
                <EditableText
                  settingKey="home_hero_title"
                  defaultText={
                    "Saúde & <br /><span class='text-primary/80 italic font-serif'>Consciência</span>"
                  }
                  as="h1"
                  className="text-5xl md:text-7xl font-bold leading-tight text-balance"
                  isHtml={true}
                  multiline={true}
                />
                <EditableText
                  settingKey="home_hero_subtitle"
                  defaultText="quando a ciência encontra a ancestralidade."
                  as="p"
                  className="text-xl md:text-2xl text-muted-foreground font-serif text-balance"
                />
              </div>
              <EditableText
                settingKey="home_hero_desc"
                defaultText="Somos uma clínica médica dedicada a resgatar o equilíbrio natural do seu corpo e mente através de práticas integrativas, cannabis medicinal e psicoterapia."
                as="p"
                className="text-lg leading-relaxed text-muted-foreground max-w-lg"
                multiline={true}
              />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full text-base h-14 px-8 group shadow-lg shadow-primary/20"
                >
                  <a
                    href={
                      settings.home_hero_btn1_link?.value ||
                      'https://wa.me/5543991692047?text=OI%C3%A1%2C%20vim%20do%20Site%20e%20quero%20agendar%20uma%20consulta.'
                    }
                  >
                    <EditableText
                      settingKey="home_hero_btn1_text"
                      defaultText="Agendar consulta online"
                      as="span"
                    />
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full text-base h-14 px-8 border-primary/20 hover:bg-primary/5"
                >
                  <Link to={settings.home_hero_btn2_link?.value || '/sobre'}>
                    <EditableText
                      settingKey="home_hero_btn2_text"
                      defaultText="Conheça nossa história"
                      as="span"
                    />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal
              delay={200}
              className="relative h-[500px] md:h-[600px] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] rotate-6 scale-105 transition-all duration-700" />
              <ImageWithFallback
                src={heroImage}
                fallback="https://img.usecurling.com/p/800/1000?q=nature%20meditation&color=green"
                alt={heroAlt}
                title={settings.home_hero?.value || ''}
                className="relative z-10 w-[90%] h-[90%] object-cover rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-xl transition-all duration-1000 hover:rounded-[50%_50%_30%_70%/50%_50%_70%_30%]"
              />
            </ScrollReveal>
          </div>
        )}
      </section>

      {/* Featured Treatment Section */}
      {(loadingFeaturedTreatment || featuredTreatment) && (
        <section className="container py-12 relative z-10">
          <ScrollReveal>
            <Card className="bg-primary/5 border-none shadow-sm overflow-hidden rounded-[2rem]">
              {loadingFeaturedTreatment ? (
                <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                  <div className="space-y-6">
                    <Skeleton className="h-8 w-40 rounded-full" />
                    <Skeleton className="h-10 w-3/4 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full rounded-md" />
                      <Skeleton className="h-6 w-5/6 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-full" />
                  </div>
                  <div className="relative h-[300px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden flex items-center justify-center">
                    <Skeleton className="absolute inset-0 w-full h-full rounded-[30%_70%_70%_30%/30%_30%_70%_70%]" />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                  <div className="space-y-6">
                    <Badge
                      variant="outline"
                      className="bg-white text-primary border-none shadow-sm px-4 py-1 text-sm rounded-full"
                    >
                      <EditableText
                        settingKey="featured_treatment_badge"
                        defaultText="Tratamento em Destaque"
                        as="span"
                      />
                    </Badge>
                    <h2 className="text-3xl font-bold">{featuredTreatment.title}</h2>
                    {featuredTreatment.seo_description && (
                      <p className="text-muted-foreground text-lg">
                        {featuredTreatment.seo_description}
                      </p>
                    )}
                    <Button asChild className="rounded-full shadow-md">
                      <Link to={`/tratamentos/${featuredTreatment.slug}`}>
                        <EditableText
                          settingKey="featured_treatment_btn"
                          defaultText="Saiba mais"
                          as="span"
                        />
                      </Link>
                    </Button>
                  </div>
                  {featuredTreatment.image && (
                    <div className="relative h-[300px] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden">
                      <ImageWithFallback
                        src={pb.files.getURL(featuredTreatment, featuredTreatment.image)}
                        fallback={`https://img.usecurling.com/p/600/400?q=${encodeURIComponent(featuredTreatment.title)}&color=green`}
                        alt={featuredTreatment.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </ScrollReveal>
        </section>
      )}

      {/* Treatments Section */}
      <section className="relative py-24 bg-primary/5 mt-12">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -mt-[1px]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[50px] lg:h-[80px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.8,188.4,107.4C236.4,93.5,280.4,70.5,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>

        <div className="container mb-16 pt-8">
          <ScrollReveal>
            <EditableText
              settingKey="home_treatments_title"
              defaultText="Tratamento de:"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-center"
            />
          </ScrollReveal>
        </div>

        {loadingTreatments ? (
          <div className="flex overflow-hidden w-full pb-8 px-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-48 shrink-0">
                <Card className="bg-white border-none shadow-sm rounded-[2rem] h-full min-h-[160px]">
                  <CardContent className="p-6 flex flex-col items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          treatments.length > 0 && (
            <div className="flex overflow-hidden group w-full pb-8">
              <div className="flex shrink-0 items-center gap-6 px-3 animate-marquee group-hover:[animation-play-state:paused]">
                {treatments.map((t) => {
                  const Icon = iconMap[t.slug] || Activity
                  return (
                    <Link key={t.id} to={`/tratamentos/${t.slug}`} className="w-48 shrink-0">
                      <Card className="bg-white border-none shadow-sm text-center group/card cursor-pointer hover:shadow-md transition-all rounded-[2rem] h-full">
                        <CardContent className="p-6 flex flex-col items-center gap-4">
                          <div className="p-4 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors">
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
                    <Link
                      key={`${t.id}-dup`}
                      to={`/tratamentos/${t.slug}`}
                      className="w-48 shrink-0"
                    >
                      <Card className="bg-white border-none shadow-sm text-center group/card cursor-pointer hover:shadow-md transition-all rounded-[2rem] h-full">
                        <CardContent className="p-6 flex flex-col items-center gap-4">
                          <div className="p-4 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors">
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
          )
        )}

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none -mb-[1px]">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[50px] lg:h-[80px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,123.8,188.4,107.4C236.4,93.5,280.4,70.5,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container py-24">
        <ScrollReveal className="max-w-4xl mx-auto text-center space-y-8">
          <EditableText
            settingKey="home_philosophy_title"
            defaultText={
              'A saúde em que acreditamos: <br /><span class="italic font-normal text-primary">retorno ao o que você já é</span>'
            }
            as="h2"
            className="text-3xl md:text-5xl font-bold text-balance mb-12"
            isHtml={true}
            multiline={true}
          />
          <EditableText
            settingKey="home_philosophy_text"
            defaultText={
              '<p>Acreditamos que a verdadeira saúde não é a ausência de doenças, mas um estado de profundo alinhamento entre corpo, mente e natureza. Nossa abordagem rompe com a visão fragmentada da medicina tradicional.</p><p>Ao unir os conhecimentos milenares da Ayurveda e do uso ritualístico de plantas professoras com o rigor da ciência moderna, buscamos ir à raiz do seu sofrimento.</p><p>O fim da separação mente-corpo é o início da sua cura. Nós guiamos você nesse caminho de volta para casa, para a sua essência mais pura e equilibrada.</p>'
            }
            as="div"
            className="space-y-6 text-lg md:text-xl leading-relaxed text-muted-foreground text-left md:text-center"
            isHtml={true}
            multiline={true}
          />
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-secondary/20 rounded-3xl md:rounded-[4rem] mx-2 sm:mx-4 md:mx-12 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/800?q=leaves%20pattern&color=green')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="container px-4 md:px-8 relative z-10">
          <ScrollReveal>
            <EditableText
              settingKey="testimonials_title"
              defaultText="Conheça histórias de alguns de nossos pacientes"
              as="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16"
            />
          </ScrollReveal>

          {loadingTestimonials ? (
            <div className="grid md:grid-cols-2 gap-10 md:gap-12 w-full">
              <div className="space-y-6">
                <Skeleton className="h-8 w-64 border-b border-primary/10 pb-4" />
                <Card className="w-full h-48 bg-white border-none shadow-sm rounded-3xl flex flex-col">
                  <CardContent className="flex-1 p-8 flex flex-col">
                    <Skeleton className="h-16 w-full mb-6 grow" />
                    <div className="flex items-center gap-4 mt-auto shrink-0">
                      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-64 border-b border-primary/10 pb-4" />
                <Card className="w-full h-48 bg-white border-none shadow-sm rounded-3xl flex flex-col">
                  <CardContent className="flex-1 p-8 flex flex-col">
                    <Skeleton className="h-16 w-full mb-6 grow" />
                    <div className="flex items-center gap-4 mt-auto shrink-0">
                      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              {/* Dr. Felipe */}
              {testimonialsFelipeDb.length > 0 && (
                <ScrollReveal delay={100} className="space-y-6">
                  <EditableText
                    settingKey="testimonials_subtitle_felipe"
                    defaultText="Pacientes Dr. Felipe Zamboni"
                    as="h3"
                    className="text-xl font-serif text-primary border-b border-primary/10 pb-4"
                  />

                  {/* Mobile: Single-column stack */}
                  <div className="flex flex-col gap-6 md:hidden">
                    {testimonialsFelipeDb.map((t, i) => (
                      <Card
                        key={i}
                        className="w-full bg-white border-none shadow-sm rounded-3xl flex flex-col h-full"
                      >
                        <CardContent className="flex-1 p-6 flex flex-col">
                          <p className="text-muted-foreground italic text-base leading-relaxed break-words mb-6 grow">
                            "{t.content}"
                          </p>
                          <div className="flex items-center gap-4 mt-auto shrink-0">
                            {t.image && t.collectionId && t.id ? (
                              <ImageWithFallback
                                src={pb.files.getURL(t, t.image)}
                                fallback="https://img.usecurling.com/ppl/thumbnail"
                                alt={t.patient_name}
                                className="w-12 h-12 rounded-full object-cover shrink-0 aspect-square"
                              />
                            ) : null}
                            <p className="font-semibold text-base">{t.patient_name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop: Carousel */}
                  <Carousel className="w-full hidden md:block">
                    <CarouselContent className="items-stretch">
                      {testimonialsFelipeDb.map((t, i) => (
                        <CarouselItem key={i} className="h-auto">
                          <Card className="w-full h-full bg-white border-none shadow-sm rounded-3xl flex flex-col">
                            <CardContent className="flex-1 p-8 flex flex-col">
                              <p className="text-muted-foreground italic text-lg leading-relaxed break-words mb-6 grow">
                                "{t.content}"
                              </p>
                              <div className="flex items-center gap-4 mt-auto shrink-0">
                                {t.image && t.collectionId && t.id ? (
                                  <ImageWithFallback
                                    src={pb.files.getURL(t, t.image)}
                                    fallback="https://img.usecurling.com/ppl/thumbnail"
                                    alt={t.patient_name}
                                    className="w-12 h-12 rounded-full object-cover shrink-0 aspect-square"
                                  />
                                ) : null}
                                <p className="font-semibold text-base">{t.patient_name}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-4">
                      <CarouselPrevious className="relative inset-auto translate-y-0 bg-white hover:bg-white border-none shadow-sm" />
                      <CarouselNext className="relative inset-auto translate-y-0 bg-white hover:bg-white border-none shadow-sm" />
                    </div>
                  </Carousel>
                </ScrollReveal>
              )}

              {/* Dra. Beatriz */}
              {testimonialsBeatrizDb.length > 0 && (
                <ScrollReveal delay={200} className="space-y-6">
                  <EditableText
                    settingKey="testimonials_subtitle_beatriz"
                    defaultText="Pacientes Dra. Beatriz Mulari"
                    as="h3"
                    className="text-xl font-serif text-primary border-b border-primary/10 pb-4"
                  />

                  {/* Mobile: Single-column stack */}
                  <div className="flex flex-col gap-6 md:hidden">
                    {testimonialsBeatrizDb.map((t, i) => (
                      <Card
                        key={i}
                        className="w-full bg-white border-none shadow-sm rounded-3xl flex flex-col h-full"
                      >
                        <CardContent className="flex-1 p-6 flex flex-col">
                          <p className="text-muted-foreground italic text-base leading-relaxed break-words mb-6 grow">
                            "{t.content}"
                          </p>
                          <div className="flex items-center gap-4 mt-auto shrink-0">
                            {t.image && t.collectionId && t.id ? (
                              <ImageWithFallback
                                src={pb.files.getURL(t, t.image)}
                                fallback="https://img.usecurling.com/ppl/thumbnail"
                                alt={t.patient_name}
                                className="w-12 h-12 rounded-full object-cover shrink-0 aspect-square"
                              />
                            ) : null}
                            <p className="font-semibold text-base">{t.patient_name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Desktop: Carousel */}
                  <Carousel className="w-full hidden md:block">
                    <CarouselContent className="items-stretch">
                      {testimonialsBeatrizDb.map((t, i) => (
                        <CarouselItem key={i} className="h-auto">
                          <Card className="w-full h-full bg-white border-none shadow-sm rounded-3xl flex flex-col">
                            <CardContent className="flex-1 p-8 flex flex-col">
                              <p className="text-muted-foreground italic text-lg leading-relaxed break-words mb-6 grow">
                                "{t.content}"
                              </p>
                              <div className="flex items-center gap-4 mt-auto shrink-0">
                                {t.image && t.collectionId && t.id ? (
                                  <ImageWithFallback
                                    src={pb.files.getURL(t, t.image)}
                                    fallback="https://img.usecurling.com/ppl/thumbnail"
                                    alt={t.patient_name}
                                    className="w-12 h-12 rounded-full object-cover shrink-0 aspect-square"
                                  />
                                ) : null}
                                <p className="font-semibold text-base">{t.patient_name}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-4">
                      <CarouselPrevious className="relative inset-auto translate-y-0 bg-white hover:bg-white border-none shadow-sm" />
                      <CarouselNext className="relative inset-auto translate-y-0 bg-white hover:bg-white border-none shadow-sm" />
                    </div>
                  </Carousel>
                </ScrollReveal>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      {posts.length > 0 && (
        <section className="container py-24">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-4">
                <EditableText
                  settingKey="home_blog_title"
                  defaultText="Nosso Blog"
                  as="h2"
                  className="text-3xl md:text-4xl font-bold"
                />
                <EditableText
                  settingKey="home_blog_desc"
                  defaultText="Artigos, reflexões e informações sobre saúde integrativa e terapias naturais."
                  as="p"
                  className="text-muted-foreground text-lg max-w-2xl"
                  multiline={true}
                />
              </div>
              <Button variant="outline" asChild className="rounded-full shadow-sm">
                <Link to={settings.home_blog_btn_link?.value || '/blog'}>
                  <EditableText
                    settingKey="home_blog_btn_text"
                    defaultText="Ver todos os artigos"
                    as="span"
                  />
                </Link>
              </Button>
            </div>
            {loadingPosts ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="h-full bg-white border-none shadow-sm flex flex-col rounded-[2rem] overflow-hidden"
                  >
                    <Skeleton className="h-48 w-full rounded-b-[30%]" />
                    <CardContent className="p-8 flex-1 flex flex-col gap-4 mt-4">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-4/5" />
                      <Skeleton className="h-16 w-full mt-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                    <Card className="h-full bg-white border-none shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col rounded-[2rem]">
                      <div className="relative h-48 overflow-hidden rounded-b-[30%] bg-primary/5">
                        <ImageWithFallback
                          src={getPostImageUrl(post)}
                          fallback={`https://img.usecurling.com/p/600/400?q=${encodeURIComponent(post.title)}&color=green`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-8 flex-1 flex flex-col">
                        {post.category && (
                          <Badge
                            variant="secondary"
                            className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3"
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
            )}
          </ScrollReveal>
        </section>
      )}

      {/* Consultation Info */}
      <section className="container pb-12">
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border-none max-w-5xl mx-auto shadow-sm">
          <ScrollReveal className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <EditableText
                settingKey="expectations_title"
                defaultText={expTitle}
                as="h2"
                className="text-3xl md:text-4xl font-bold text-balance"
              />
              <EditableText
                settingKey="expectations_items"
                defaultText={expItemsRaw}
                as="div"
                multiline={true}
              >
                <ul className="space-y-4 text-muted-foreground">
                  {expItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1 shrink-0">
                        ✓
                      </div>
                      <p>{item.trim()}</p>
                    </li>
                  ))}
                </ul>
              </EditableText>
              <Button
                asChild
                size="lg"
                className="rounded-full w-full sm:w-auto h-14 px-8 mt-4 shadow-md"
              >
                <a
                  href={
                    settings.expectations_button_link?.value ||
                    'https://wa.me/5543991692047?text=OI%C3%A1%2C%20vim%20do%20Site%20e%20quero%20agendar%20uma%20consulta.'
                  }
                >
                  <EditableText
                    settingKey="expectations_button_text"
                    defaultText={expBtnText}
                    as="span"
                  />
                </a>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] overflow-hidden hidden md:block shadow-lg">
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
