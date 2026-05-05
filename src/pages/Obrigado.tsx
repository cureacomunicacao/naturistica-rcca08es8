import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSettings } from '@/hooks/use-settings'
import { Loader2, CheckCircle } from 'lucide-react'

export default function Obrigado() {
  const location = useLocation()
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const data = location.state
    if (!data) {
      navigate('/contato')
      return
    }

    const timer = setTimeout(() => {
      setRedirecting(true)

      const phone = settings['whatsapp_contact_number']?.value || '5543991692047'
      const rawPhone = phone.replace(/\D/g, '')

      const lines = [
        '*Novo Contato do Site*',
        '',
        `*Nome:* ${data.name}`,
        `*Email:* ${data.email || 'Não informado'}`,
        `*Telefone:* ${data.phone}`,
        `*Interesse:* ${data.treatmentName || 'Não especificado'}`,
        `*Mensagem:* ${data.message || 'Sem mensagem'}`,
      ]

      const msg = lines.join('\n')
      const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`

      window.location.href = url
    }, 1500)

    return () => clearTimeout(timer)
  }, [location, navigate, settings])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">
        Obrigado! Estamos te direcionando para o WhatsApp...
      </h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        Seus dados foram recebidos com sucesso.
      </p>

      <div className="flex items-center gap-3 text-primary bg-primary/10 px-6 py-3 rounded-full">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-medium">
          {redirecting ? 'Abrindo WhatsApp...' : 'Aguarde um instante...'}
        </span>
      </div>
    </div>
  )
}
