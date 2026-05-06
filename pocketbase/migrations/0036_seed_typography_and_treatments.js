migrate(
  (app) => {
    const settings = [
      { key: 'blog_font_family', value: 'system-ui, sans-serif' },
      { key: 'blog_h1_size', value: '2.25rem' },
      { key: 'blog_h2_size', value: '1.875rem' },
      { key: 'blog_h3_size', value: '1.5rem' },
      { key: 'blog_body_size', value: '1.125rem' },
      { key: 'treatment_font_family', value: 'system-ui, sans-serif' },
      { key: 'treatment_h1_size', value: '2.25rem' },
      { key: 'treatment_h2_size', value: '1.875rem' },
      { key: 'treatment_h3_size', value: '1.5rem' },
      { key: 'treatment_body_size', value: '1.125rem' },
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

    const treatments = [
      { title: 'Redução de Danos', slug: 'reducao-de-danos' },
      { title: 'Estresse Crônico', slug: 'estresse-cronico' },
      { title: 'Enxaqueca', slug: 'enxaqueca' },
      { title: 'TDAH', slug: 'tdah' },
      { title: 'Trauma', slug: 'trauma' },
      { title: 'Ansiedade', slug: 'ansiedade' },
      { title: 'Insônia', slug: 'insonia' },
      { title: 'Burnout', slug: 'burnout' },
    ]
    const tCol = app.findCollectionByNameOrId('treatments')
    for (const t of treatments) {
      try {
        app.findFirstRecordByData('treatments', 'slug', t.slug)
      } catch (_) {
        const record = new Record(tCol)
        record.set('title', t.title)
        record.set('slug', t.slug)
        record.set('active', true)
        record.set('show_on_home', true)
        app.save(record)
      }
    }
  },
  (app) => {},
)
