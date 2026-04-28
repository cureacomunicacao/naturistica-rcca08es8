migrate(
  (app) => {
    const settingsCollection = app.findCollectionByNameOrId('site_settings')

    const settingsToSeed = [
      {
        key: 'expectations_title',
        value: 'O que esperar da sua consulta e acompanhamento?',
      },
      {
        key: 'expectations_items',
        value:
          'Consultas longas (1h30 de duração) com escuta ativa e acolhimento.\nAtendimento 100% online (Telemedicina) no conforto da sua casa.\nPrescrições digitais seguras enviadas diretamente no seu WhatsApp.\nSuporte contínuo via WhatsApp para dúvidas e ajustes de tratamento.',
      },
      {
        key: 'expectations_button_text',
        value: 'Agendar consulta online',
      },
      {
        key: 'expectations_image_alt',
        value: 'Consulta Online',
      },
    ]

    for (const setting of settingsToSeed) {
      try {
        app.findFirstRecordByData('site_settings', 'key', setting.key)
      } catch (_) {
        const record = new Record(settingsCollection)
        record.set('key', setting.key)
        record.set('value', setting.value)
        app.save(record)
      }
    }
  },
  (app) => {
    const keys = [
      'expectations_title',
      'expectations_items',
      'expectations_button_text',
      'expectations_image_alt',
    ]

    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
