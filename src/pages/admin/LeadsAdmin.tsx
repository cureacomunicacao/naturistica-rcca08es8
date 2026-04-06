import { useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const fetchLeads = async () => {
    try {
      const records = await pb
        .collection('leads')
        .getFullList({ sort: '-created', expand: 'treatment_ref' })
      setLeads(records)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  useRealtime('leads', fetchLeads)

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(search.toLowerCase())),
  )

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Data,Nome,Email,Telefone,Tratamento,Mensagem\n' +
      filteredLeads
        .map(
          (l) =>
            `${new Date(l.created).toLocaleDateString()},${l.name},${l.email},${l.phone},${l.expand?.treatment_ref?.title || ''},"${l.message?.replace(/"/g, '""') || ''}"`,
        )
        .join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'leads_naturistica.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Leads (Contatos)</h1>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
      </div>

      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Tratamento</TableHead>
              <TableHead>Mensagem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{new Date(lead.created).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{lead.email}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                  </TableCell>
                  <TableCell>{lead.expand?.treatment_ref?.title || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate" title={lead.message}>
                    {lead.message || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
