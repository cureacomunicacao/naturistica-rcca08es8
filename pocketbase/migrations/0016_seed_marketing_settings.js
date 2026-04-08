migrate(
  (app) => {
    const settingsCol = app.findCollectionByNameOrId('site_settings')

    const keysToSeed = [
      { key: 'global_seo_title', value: 'Naturistica - Saúde e Consciência' },
      {
        key: 'global_seo_description',
        value: 'Onde a ciência encontra a ancestralidade para saúde e consciência.',
      },
      { key: 'global_seo_keywords', value: 'saúde, bem-estar, natureza' },
      { key: 'header_scripts', value: '' },
      { key: 'body_scripts', value: '' },
      { key: 'whatsapp_tracking_script', value: "console.log('WhatsApp button clicked');" },
      { key: 'google_business_url', value: '' },
      { key: 'global_og_image', value: '' },
    ]

    for (const item of keysToSeed) {
      try {
        app.findFirstRecordByData('site_settings', 'key', item.key)
      } catch (_) {
        const record = new Record(settingsCol)
        record.set('key', item.key)
        record.set('value', item.value)
        app.save(record)
      }
    }
  },
  (app) => {
    // Retain data on downgrade
  },
)
