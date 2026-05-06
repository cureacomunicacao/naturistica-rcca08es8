migrate(
  (app) => {
    const settings = [
      { key: 'treatment_h1_size', value: '48' },
      { key: 'treatment_h2_size', value: '32' },
      { key: 'treatment_h3_size', value: '24' },
      { key: 'treatment_body_size', value: '18' },
      { key: 'blog_h1_size', value: '48' },
      { key: 'blog_h2_size', value: '32' },
      { key: 'blog_h3_size', value: '24' },
      { key: 'blog_body_size', value: '18' },
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
    const keys = [
      'treatment_h1_size',
      'treatment_h2_size',
      'treatment_h3_size',
      'treatment_body_size',
      'blog_h1_size',
      'blog_h2_size',
      'blog_h3_size',
      'blog_body_size',
    ]
    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
