migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')

    const settings = [
      { key: 'expectations_title', value: 'O que esperar da sua consulta e acompanhamento?' },
      {
        key: 'expectations_items',
        value:
          'Consultas longas (1h30 de duração) com escuta ativa e acolhimento.\nAtendimento 100% online (Telemedicina) no conforto da sua casa.\nPrescrições digitais seguras enviadas diretamente no seu WhatsApp.\nSuporte contínuo via WhatsApp para dúvidas e ajustes de tratamento.',
      },
      { key: 'expectations_button_text', value: 'Agendar consulta online' },
      { key: 'expectations_image', value: '' },
    ]

    settings.forEach((s) => {
      try {
        app.findFirstRecordByData('site_settings', 'key', s.key)
      } catch (_) {
        const record = new Record(col)
        record.set('key', s.key)
        if (s.value) {
          record.set('value', s.value)
        }
        app.save(record)
      }
    })
  },
  (app) => {
    const keys = [
      'expectations_title',
      'expectations_items',
      'expectations_button_text',
      'expectations_image',
    ]
    keys.forEach((key) => {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    })
  },
)
