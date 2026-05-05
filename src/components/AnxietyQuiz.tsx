import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const questions = [
  'Nas últimas duas semanas, com que frequência você se sentiu nervoso(a), ansioso(a) ou muito tenso(a)?',
  'Não foi capaz de parar ou controlar as preocupações?',
  'Preocupou-se muito com diversas coisas diferentes?',
  'Teve dificuldade para relaxar?',
  'Ficou tão agitado(a) que foi difícil ficar parado(a)?',
  'Ficou facilmente aborrecido(a) ou irritado(a)?',
  'Sentiu medo como se algo terrível fosse acontecer?',
]

const options = [
  { label: 'Nenhuma vez', score: 0 },
  { label: 'Vários dias', score: 1 },
  { label: 'Mais da metade dos dias', score: 2 },
  { label: 'Quase todos os dias', score: 3 },
]

export function AnxietyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [finished, setFinished] = useState(false)

  const handleAnswer = (score: number) => {
    const newScores = [...scores, score]

    if (currentQuestion < questions.length - 1) {
      setScores(newScores)
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setScores(newScores)
      setFinished(true)
    }
  }

  const totalScore = scores.reduce((a, b) => a + b, 0)

  let result = { level: '', message: '', icon: CheckCircle, color: '' }
  if (totalScore <= 4) {
    result = {
      level: 'Baixa',
      message:
        'Seus níveis de ansiedade parecem mínimos. Continue cultivando bons hábitos e cuidando de si mesmo(a)!',
      icon: CheckCircle,
      color: 'text-green-600',
    }
  } else if (totalScore <= 9) {
    result = {
      level: 'Leve',
      message:
        'Você apresenta alguns sinais leves de ansiedade. Práticas de relaxamento e mudanças pontuais no estilo de vida podem ser muito benéficas.',
      icon: AlertCircle,
      color: 'text-yellow-600',
    }
  } else if (totalScore <= 14) {
    result = {
      level: 'Moderada',
      message:
        'Sua ansiedade está em um nível moderado. É altamente recomendável buscar acompanhamento com nossos profissionais para desenvolver estratégias naturais e eficazes de enfrentamento.',
      icon: AlertTriangle,
      color: 'text-orange-600',
    }
  } else {
    result = {
      level: 'Alta',
      message:
        'Seus resultados indicam sinais significativos de ansiedade severa. Procure nossa equipe para um suporte profissional e integrativo o quanto antes.',
      icon: AlertTriangle,
      color: 'text-red-600',
    }
  }

  const whatsappUrl =
    'https://wa.me/5543991692047?text=OI%C3%A1%2C%20vim%20do%20Site%20e%20quero%20agendar%20uma%20consulta.'

  const Icon = result.icon

  if (finished) {
    return (
      <Card className="w-full max-w-2xl mx-auto my-12 bg-white border border-[#455e38]/20 shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center mb-2">
            <Icon className={cn('w-20 h-20', result.color)} />
          </div>
          <h3 className="text-3xl font-serif font-bold text-gray-900">
            Nível de Ansiedade: <span className={result.color}>{result.level}</span>
          </h3>
          <div className="inline-block bg-gray-50 px-6 py-2 rounded-xl">
            <p className="text-lg text-gray-700 font-medium">
              Sua pontuação: <span className="font-bold">{totalScore}</span> de 21
            </p>
          </div>
          <p className="text-gray-700 text-lg max-w-lg mx-auto leading-relaxed">{result.message}</p>

          <div className="pt-8 mt-4 border-t border-gray-100">
            <h4 className="text-2xl font-bold font-serif text-[#455e38] mb-4">
              Não enfrente isso sozinho(a)
            </h4>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Nossa equipe multidisciplinar integrativa está pronta para te acolher com tratamentos
              naturais e psicoterapia focada na sua jornada de cura.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#455e38] hover:bg-[#455e38]/90 text-white rounded-full px-8 h-14 w-full sm:w-auto text-lg flex items-center justify-center mx-auto"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Consulta via WhatsApp
              </a>
            </Button>
            <div className="mt-6">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setScores([])
                  setCurrentQuestion(0)
                  setFinished(false)
                }}
              >
                Refazer o Teste
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-12 bg-white border border-[#455e38]/20 shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-[#455e38] px-6 py-5">
        <div className="flex justify-between items-center text-white text-sm font-medium mb-3">
          <span>
            Pergunta {currentQuestion + 1} de {questions.length}
          </span>
          <span>{Math.round((currentQuestion / questions.length) * 100)}% concluído</span>
        </div>
        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500 ease-out"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <CardContent className="p-6 md:p-10">
        <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-8 leading-snug text-center">
          {questions[currentQuestion]}
        </h3>
        <div className="grid gap-4">
          {options.map((option, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="w-full justify-start text-left h-auto py-4 px-6 rounded-xl border-gray-200 hover:border-[#455e38] hover:bg-[#455e38]/5 transition-all text-gray-700 whitespace-normal text-lg shadow-sm hover:shadow"
              onClick={() => handleAnswer(option.score)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
