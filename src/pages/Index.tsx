import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

export default function Index() {
  const { settings } = useSettings()
  const [treatments, setTreatments] = useState<any[]>([])

  useEffect(() => {
    pb.collection('treatments')
      .getFullList({ sort: 'created' })
      .then(setTreatments)
      .catch(console.error)
  }, [])

  const heroImage = settings.home_hero?.image
    ? pb.files.getURL(settings.home_hero, settings.home_hero.image)
    : 'https://img.usecurling.com/p/800/1000?q=nature%20meditation&color=green'

  const heroAlt = settings.home_hero?.image_alt || 'Natureza e serenidade'

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
              <Button size="lg" className="rounded-full text-base h-14 px-8 group">
                Agendar consulta online
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base h-14 px-8">
                Conheça nossa história
              </Button>
            </div>
          </ScrollReveal>
          <ScrollReveal
            delay={200}
            className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden"
          >
            <img
              src={heroImage}
              alt={heroAlt}
              title={settings.home_hero?.value || ''}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </ScrollReveal>
        </div>
      </section>

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
          <h2 className="text-3xl md:text-5xl font-bold text-balance mb-12">
            A saúde em que acreditamos: <br />
            <span className="italic font-normal text-primary">retorno ao o que você já é</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed text-muted-foreground text-left md:text-center">
            <p>
              Acreditamos que a verdadeira saúde não é a ausência de doenças, mas um estado de
              profundo alinhamento entre corpo, mente e natureza. Nossa abordagem rompe com a visão
              fragmentada da medicina tradicional.
            </p>
            <p>
              Ao unir os conhecimentos milenares da Ayurveda e do uso ritualístico de plantas
              professoras com o rigor da ciência moderna, buscamos ir à raiz do seu sofrimento.
            </p>
            <p>
              O fim da separação mente-corpo é o início da sua cura. Nós guiamos você nesse caminho
              de volta para casa, para a sua essência mais pura e equilibrada.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Testimonials */}
      <section className="bg-primary/5 py-24 overflow-hidden">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Conheça histórias de alguns de nossos pacientes
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
                  {testimonialsFelipe.map((t, i) => (
                    <CarouselItem key={i}>
                      <Card className="bg-background border-none shadow-sm">
                        <CardContent className="p-8 space-y-4">
                          <p className="text-muted-foreground italic text-lg leading-relaxed">
                            "{t.text}"
                          </p>
                          <p className="font-semibold">{t.name}</p>
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
                  {testimonialsBeatriz.map((t, i) => (
                    <CarouselItem key={i}>
                      <Card className="bg-background border-none shadow-sm">
                        <CardContent className="p-8 space-y-4">
                          <p className="text-muted-foreground italic text-lg leading-relaxed">
                            "{t.text}"
                          </p>
                          <p className="font-semibold">{t.name}</p>
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

      {/* Consultation Info */}
      <section className="container pb-24">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-border/50 max-w-5xl mx-auto">
          <ScrollReveal className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-balance">
                O que esperar da sua consulta e acompanhamento?
              </h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                    ✓
                  </div>
                  <p>Consultas longas (1h30 de duração) com escuta ativa e acolhimento.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                    ✓
                  </div>
                  <p>Atendimento 100% online (Telemedicina) no conforto da sua casa.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                    ✓
                  </div>
                  <p>Prescrições digitais seguras enviadas diretamente no seu WhatsApp.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1 shrink-0">
                    ✓
                  </div>
                  <p>Suporte contínuo via WhatsApp para dúvidas e ajustes de tratamento.</p>
                </li>
              </ul>
              <Button size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 mt-4">
                Agendar consulta online
              </Button>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden hidden md:block">
              <img
                src="https://img.usecurling.com/p/600/800?q=online%20consultation%20laptop&color=green"
                alt="Consulta Online"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
