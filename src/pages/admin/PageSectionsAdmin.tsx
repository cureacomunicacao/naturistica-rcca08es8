import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import {
  getAllPageSectionsAdmin,
  updatePageSectionOrder,
  togglePageSectionActive,
  deletePageSection,
  type PageSectionRecord,
} from '@/services/page_sections'

export default function PageSectionsAdmin() {
  const [sections, setSections] = useState<PageSectionRecord[]>([])
  const { toast } = useToast()

  const load = () => {
    getAllPageSectionsAdmin('home')
      .then(setSections)
      .catch((err) => toast({ title: 'Erro', description: err.message, variant: 'destructive' }))
  }

  useEffect(() => {
    load()
  }, [])

  const moveUp = async (index: number) => {
    if (index === 0) return
    const newSections = [...sections]
    const temp = newSections[index - 1]
    newSections[index - 1] = newSections[index]
    newSections[index] = temp
    setSections(newSections)

    try {
      await Promise.all([
        updatePageSectionOrder(newSections[index - 1].id, index - 1),
        updatePageSectionOrder(newSections[index].id, index),
      ])
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
      load()
    }
  }

  const moveDown = async (index: number) => {
    if (index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index + 1]
    newSections[index + 1] = newSections[index]
    newSections[index] = temp
    setSections(newSections)

    try {
      await Promise.all([
        updatePageSectionOrder(newSections[index + 1].id, index + 1),
        updatePageSectionOrder(newSections[index].id, index),
      ])
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
      load()
    }
  }

  const handleToggle = async (id: string, active: boolean) => {
    try {
      setSections(sections.map((s) => (s.id === id ? { ...s, active } : s)))
      await togglePageSectionActive(id, active)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
      load()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir seção?')) return
    try {
      await deletePageSection(id)
      toast({ title: 'Seção excluída' })
      load()
    } catch (e: any) {
      toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Construtor de Seções (Home)</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as seções dinâmicas da página inicial.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/sections/new">
            <Plus className="w-4 h-4 mr-2" /> Nova Seção
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <Card key={s.id} className="flex items-center p-4 gap-4">
            <div className="flex flex-col gap-1">
              <Button variant="outline" size="sm" onClick={() => moveUp(i)} disabled={i === 0}>
                ▲
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveDown(i)}
                disabled={i === sections.length - 1}
              >
                ▼
              </Button>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{s.title || '(Sem título)'}</div>
              <div className="text-sm text-muted-foreground font-medium uppercase mt-1">
                {s.type.replace(/_/g, ' ')}
              </div>
            </div>
            <div className="flex items-center gap-2 mr-4">
              <Switch checked={s.active} onCheckedChange={(v) => handleToggle(s.id, v)} />
              <span className="text-sm text-muted-foreground">{s.active ? 'Ativo' : 'Oculto'}</span>
            </div>
            <Button asChild variant="outline" size="icon">
              <Link to={`/admin/sections/${s.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="destructive" size="icon" onClick={() => handleDelete(s.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
        {sections.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            Nenhuma seção criada. Clique em "Nova Seção" para adicionar conteúdo dinâmico à página
            inicial.
          </div>
        )}
      </div>
    </div>
  )
}
