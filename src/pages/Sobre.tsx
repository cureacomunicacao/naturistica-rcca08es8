import { ScrollReveal } from '@/components/ScrollReveal'
import { useSettings } from '@/hooks/use-settings'
import pb from '@/lib/pocketbase/client'
import { SEO } from '@/components/SEO'

export default function Sobre() {
  const { settings } = useSettings()

  const mainImage = settings.about_main_image?.image
    ? pb.files.getURL(settings.about_main_image, settings.about_main_image.image)
    : 'https://img.usecurling.com/p/600/800?q=doctor%20plants&color=green'

  const imgAlt = settings.about_main_image?.image_alt || 'Dra Beatriz e Dr Felipe'

  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <SEO
        title={settings.about_seo_title?.value || 'Nossa História | Naturistica'}
        description={
          settings.about_seo_description?.value ||
          'Conheça a história da Naturistica e nossos fundadores.'
        }
      />
      <ScrollReveal className="space-y-8 text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-balance">Nossa História</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif">
          Da Universidade Estadual de Londrina (UEL) para a criação de um espaço de cura
          integrativa.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <ScrollReveal
          delay={100}
          className="order-2 md:order-1 relative h-[500px] rounded-3xl overflow-hidden"
        >
          <img
            src={mainImage}
            alt={imgAlt}
            title={settings.about_main_image?.value || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </ScrollReveal>
        <ScrollReveal
          delay={200}
          className="order-1 md:order-2 space-y-6 text-lg text-muted-foreground"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">A Jornada Naturistica</h2>
          <p>
            Nossa história começou nos corredores da Universidade Estadual de Londrina (UEL), onde a
            paixão pela medicina se encontrou com o desejo de ir além do tratamento de sintomas.
            Percebemos cedo que a medicina ocidental, embora brilhante em crises agudas, muitas
            vezes falhava em oferecer cura real para condições crônicas e sofrimentos da alma.
          </p>
          <p>
            A Naturistica nasceu da necessidade de unir o rigor científico da nossa formação com a
            sabedoria ancestral. Vimos pacientes peregrinarem por diversos especialistas sem
            encontrar alívio para ansiedade, insônia e dores crônicas.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid md:grid-cols-2 gap-16 mb-24">
        <ScrollReveal className="space-y-6 bg-white p-8 md:p-12 rounded-3xl border border-border/50">
          <h3 className="text-2xl font-bold text-primary">Dr. Felipe Zamboni</h3>
          <p className="text-muted-foreground leading-relaxed">
            Especialista em abordagens mente-corpo, o Dr. Felipe integrou seus estudos em medicina
            com a psicoterapia Gestalt e conhecimentos profundos sobre enteógenos e plantas
            medicinais. Sua escuta atenta busca desvendar as raízes emocionais dos sintomas físicos,
            guiando os pacientes para a autonomia de sua própria saúde.
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={100}
          className="space-y-6 bg-white p-8 md:p-12 rounded-3xl border border-border/50"
        >
          <h3 className="text-2xl font-bold text-primary">Dra. Beatriz Mulari</h3>
          <p className="text-muted-foreground leading-relaxed">
            Com foco em saúde feminina, Ayurveda e medicina canabinoide, a Dra. Beatriz traz uma
            perspectiva holística onde nutrição, rotina e tratamentos naturais se encontram. Sua
            abordagem gentil e baseada em evidências científicas modernas proporciona um ambiente
            seguro para transformações profundas de estilo de vida.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal className="text-center max-w-3xl mx-auto space-y-6 bg-primary/5 p-12 rounded-3xl">
        <h2 className="text-3xl font-bold font-serif">Nossa Filosofia</h2>
        <p className="text-lg text-muted-foreground">
          Trabalhamos com Cannabis Medicinal, Psicoterapia, Ayurveda e Enteógenos não como
          alternativas isoladas, mas como ferramentas complementares. Acreditamos que a cura
          acontece quando restauramos a comunicação perdida entre a mente, o corpo e a natureza que
          nos cerca.
        </p>
      </ScrollReveal>
    </div>
  )
}
