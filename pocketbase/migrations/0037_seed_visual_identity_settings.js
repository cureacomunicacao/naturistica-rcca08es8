migrate(
  (app) => {
    const settings = [
      { key: 'typography_blog_font_family', value: 'inherit' },
      { key: 'typography_blog_h1_size', value: '2.5rem' },
      { key: 'typography_blog_h2_size', value: '2rem' },
      { key: 'typography_blog_h3_size', value: '1.75rem' },
      { key: 'typography_blog_p_size', value: '1.125rem' },
      { key: 'typography_treatment_font_family', value: 'inherit' },
      { key: 'typography_treatment_h1_size', value: '2.5rem' },
      { key: 'typography_treatment_h2_size', value: '2rem' },
      { key: 'typography_treatment_h3_size', value: '1.75rem' },
      { key: 'typography_treatment_p_size', value: '1.125rem' },
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
      'typography_blog_font_family',
      'typography_blog_h1_size',
      'typography_blog_h2_size',
      'typography_blog_h3_size',
      'typography_blog_p_size',
      'typography_treatment_font_family',
      'typography_treatment_h1_size',
      'typography_treatment_h2_size',
      'typography_treatment_h3_size',
      'typography_treatment_p_size',
    ]
    for (const k of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', k)
        app.delete(record)
      } catch (_) {}
    }
  },
)
