migrate(
  (app) => {
    const settings = app.findCollectionByNameOrId('site_settings')

    const links = [
      { key: 'whatsapp_link', value: 'https://wa.me/5511999999999' },
      { key: 'dr_felipe_link', value: 'https://wa.me/5511999999999' },
      { key: 'dra_beatriz_link', value: 'https://wa.me/5511999999999' },
    ]

    for (const link of links) {
      try {
        app.findFirstRecordByData('site_settings', 'key', link.key)
      } catch (_) {
        const record = new Record(settings)
        record.set('key', link.key)
        record.set('value', link.value)
        app.save(record)
      }
    }
  },
  (app) => {
    const keys = ['whatsapp_link', 'dr_felipe_link', 'dra_beatriz_link']
    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
