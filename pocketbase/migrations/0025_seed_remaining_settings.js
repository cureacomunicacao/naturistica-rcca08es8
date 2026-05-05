migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')

    const settings = [
      { key: 'global_brand_name', value: 'NATURISTICA' },
      { key: 'testimonials_felipe_title', value: 'Pacientes Dr. Felipe Zamboni' },
      { key: 'testimonials_beatriz_title', value: 'Pacientes Dra. Beatriz Mulari' },
      {
        key: 'footer_description',
        value:
          'Onde a ciência encontra a ancestralidade para saúde e consciência. Tratamento médico humanizado e integrativo.',
      },
      { key: 'footer_nav_title', value: 'Navegação' },
      { key: 'footer_treatments_title', value: 'Tratamentos' },
      { key: 'footer_contact_title', value: 'Contato' },
      { key: 'footer_instagram_btn', value: 'Siga no Instagram' },
      { key: 'footer_copyright', value: '© {year} Naturistica. Todos os direitos reservados.' },
      { key: 'featured_treatment_badge', value: 'Tratamento em Destaque' },
      { key: 'featured_treatment_btn', value: 'Saiba mais' },
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
    const keys = [
      'global_brand_name',
      'testimonials_felipe_title',
      'testimonials_beatriz_title',
      'footer_description',
      'footer_nav_title',
      'footer_treatments_title',
      'footer_contact_title',
      'footer_instagram_btn',
      'footer_copyright',
      'featured_treatment_badge',
      'featured_treatment_btn',
    ]
    for (const k of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', k)
        app.delete(record)
      } catch (_) {}
    }
  },
)
