migrate(
  (app) => {
    const settings = [
      { key: 'font_heading', value: 'Playfair Display' },
      { key: 'font_body', value: 'Inter' },
    ]

    const col = app.findCollectionByNameOrId('site_settings')
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
    const keys = ['font_heading', 'font_body']
    for (const k of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', k)
        app.delete(record)
      } catch (_) {}
    }
  },
)
