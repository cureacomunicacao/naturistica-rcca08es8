migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')

    const settings = [
      { key: 'contact_address', value: 'Av. Principal, 1000 - Centro' },
      { key: 'contact_email', value: 'contato@naturistica.com.br' },
    ]

    for (const s of settings) {
      try {
        app.findFirstRecordByData('site_settings', 'key', s.key)
      } catch (_) {
        const record = new Record(col)
        record.set('key', s.key)
        record.set('value', s.value)
        app.save(record)
      }
    }
  },
  (app) => {
    const settings = ['contact_address', 'contact_email']
    for (const key of settings) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
