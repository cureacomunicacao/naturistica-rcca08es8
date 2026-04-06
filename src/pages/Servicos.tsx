import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ScrollReveal'
import { CheckCircle2 } from 'lucide-react'

const serviceBenefits = [
  'Avaliação completa do seu histórico médico e estilo de vida.',
  'Plano terapêutico individualizado (Medicina alopática, Fitoterapia, Cannabis).',
  'Acompanhamento psicológico integrado quando necessário.',
  'Acesso direto via WhatsApp para tirar dúvidas sobre o tratamento.',
  'Foco na resolução da causa e não apenas mascarar sintomas.',
  'Educação em saúde para que você assuma o controle do seu bem-estar.',
]

export default function Servicos() {
  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <ScrollReveal className="text-center mb-16 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">Consultas Médicas Integrativas</h1>
        <p className="text-xl text-primary font-serif italic max-w-2xl mx-auto">
          "Você não precisa esperar piorar para começar a cuidar de si."
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <ScrollReveal className="space-y-6 text-lg text-muted-foreground">
          <p>
            Muitas vezes, normalizamos o cansaço constante, o sono ruim e a ansiedade diária como
            "parte da vida moderna". Na Naturistica, acreditamos que a saúde plena é um direito e
            requer cuidado proativo.
          </p>
          <p>
            Nossas consultas são desenhadas para quebrar padrões de desconforto antes que eles se
            tornem doenças crônicas graves. Utilizamos o melhor da ciência médica atual em sinergia
            com conhecimentos ancestrais comprovados.
          </p>
          <ul className="space-y-4 pt-4">
            {serviceBenefits.slice(0, 3).map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal
          delay={200}
          className="bg-white p-8 md:p-10 rounded-3xl border border-border shadow-sm"
        >
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-center border-b pb-4">
              A Jornada do Tratamento
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-lg">Agendamento Fácil</h4>
                  <p className="text-muted-foreground text-sm">
                    Escolha seu horário pelo nosso sistema ou via WhatsApp.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-lg">Consulta Profunda</h4>
                  <p className="text-muted-foreground text-sm">
                    1h30 de escuta ativa via telemedicina segura.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-lg">Receitas e Plano</h4>
                  <p className="text-muted-foreground text-sm">
                    Envio imediato de prescrições digitais e plano de cuidados.
                  </p>
                </div>
              </div>
            </div>
            <Button size="lg" className="w-full rounded-full h-14 text-base">
              Quero agendar minha consulta
            </Button>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal className="text-center bg-primary text-primary-foreground rounded-3xl p-12">
        <h2 className="text-3xl font-bold mb-6">Pronto para transformar sua saúde?</h2>
        <p className="mb-8 max-w-2xl mx-auto text-primary-foreground/80">
          Nossa equipe está pronta para te acolher. Dê o primeiro passo em direção a uma vida com
          mais consciência, energia e equilíbrio.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="rounded-full h-14 px-10 text-primary font-semibold hover:bg-white"
        >
          Falar com o atendimento no WhatsApp
        </Button>
      </ScrollReveal>
    </div>
  )
}
