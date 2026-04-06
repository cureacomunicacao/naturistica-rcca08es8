migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')

    const settings = [
      { key: 'about_felipe_title', value: 'Dr. Felipe Zamboni' },
      {
        key: 'about_felipe_content',
        value:
          'Especialista em abordagens mente-corpo, o Dr. Felipe integrou seus estudos em medicina com a psicoterapia Gestalt e conhecimentos profundos sobre enteógenos e plantas medicinais. Sua escuta atenta busca desvendar as raízes emocionais dos sintomas físicos, guiando os pacientes para a autonomia de sua própria saúde.',
      },
      { key: 'about_felipe_image', value: '', image_alt: 'Dr. Felipe Zamboni' },
      { key: 'about_whatsapp_label', value: 'Fale conosco pelo WhatsApp' },
      { key: 'about_whatsapp_url', value: 'https://wa.me/5511999999999' },
    ]

    for (const s of settings) {
      try {
        app.findFirstRecordByData('site_settings', 'key', s.key)
      } catch (_) {
        const record = new Record(col)
        record.set('key', s.key)
        if (s.value !== undefined) record.set('value', s.value)
        if (s.image_alt !== undefined) record.set('image_alt', s.image_alt)
        app.save(record)
      }
    }
  },
  (app) => {
    const keys = [
      'about_felipe_title',
      'about_felipe_content',
      'about_felipe_image',
      'about_whatsapp_label',
      'about_whatsapp_url',
    ]
    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
