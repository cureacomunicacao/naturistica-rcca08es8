import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MessageCircle, CheckCircle2 } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollReveal'

const questions = [
  {
    id: 1,
    text: 'Nas últimas 2 semanas, com que frequência você se sentiu para baixo, deprimido(a) ou sem esperança?',
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
  },
  {
    id: 2,
    text: 'Você tem sentido pouco interesse ou prazer em fazer as coisas que costumava gostar?',
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
  },
  {
    id: 3,
    text: 'Você tem tido dificuldade para dormir (insônia) ou tem dormido demais?',
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
  },
  {
    id: 4,
    text: 'Você tem se sentido cansado(a) ou com pouca energia, mesmo sem ter feito grandes esforços físicos?',
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
  },
  {
    id: 5,
    text: 'Homens frequentemente apresentam irritabilidade e raiva. Você tem se sentido incomumente irritado(a) ou frustrado(a) com pequenas coisas?',
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
  },
  {
    id: 6,
    text: 'Mulheres frequentemente relatam sentimentos de culpa. Você tem se sentido mal consigo mesmo(a) ou achado que é um fracasso?',
    options: ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'],
  },
]

export function DepressionQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleSelect = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep]: val }))
  }

  const whatsappMessage = encodeURIComponent(
    'Olá Naturística, fiz o teste de depressão no blog e gostaria de agendar uma consulta para entender melhor meus sintomas.',
  )
  const whatsappUrl = `https://wa.me/5543991692047?text=${whatsappMessage}`

  if (showResult) {
    return (
      <ScrollReveal>
        <Card className="max-w-2xl mx-auto mt-12 overflow-hidden border-[#455e38]/20 bg-white shadow-xl rounded-3xl">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#455e38]/10 text-[#455e38] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-[#455e38]">Avaliação Concluída</h3>

            <p className="text-lg text-gray-700 italic border-l-4 border-[#455e38] pl-4 py-2 text-left bg-[#455e38]/5 rounded-r-lg">
              "não existe um teste exato para depressão mas esse foi o seu primeiro passo, converse
              com um profisisonal com apenas 1 clique"
            </p>

            <div className="pt-8">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-8 h-14 text-lg w-full sm:w-auto shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Falar com um Profissional
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    )
  }

  const q = questions[currentStep]
  const hasAnswered = !!answers[currentStep]
  const progress = (currentStep / questions.length) * 100

  return (
    <Card className="max-w-2xl mx-auto mt-12 overflow-hidden border-[#455e38]/20 shadow-lg rounded-3xl bg-white">
      <div className="h-2 bg-gray-100 w-full">
        <div
          className="h-full bg-[#455e38] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <CardContent className="p-8 md:p-10">
        <div className="mb-8">
          <span className="text-sm font-medium text-[#455e38] uppercase tracking-wider mb-2 block">
            Pergunta {currentStep + 1} de {questions.length}
          </span>
          <h3 className="text-xl md:text-2xl font-serif text-gray-900 leading-snug">{q.text}</h3>
        </div>

        <RadioGroup className="space-y-3" value={answers[currentStep]} onValueChange={handleSelect}>
          {q.options.map((opt, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={opt} id={`q${currentStep}-opt${i}`} className="peer sr-only" />
              <Label
                htmlFor={`q${currentStep}-opt${i}`}
                className="flex flex-1 items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#455e38] peer-data-[state=checked]:bg-[#455e38]/5 cursor-pointer transition-all"
              >
                <span className="text-base font-medium">{opt}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-10 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="bg-[#455e38] hover:bg-[#455e38]/90 text-white rounded-full px-8 transition-transform hover:scale-105"
          >
            {currentStep === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
