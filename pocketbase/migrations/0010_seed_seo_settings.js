migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')

    const keys = [
      'home_hero_image',
      'home_seo_title',
      'home_seo_description',
      'about_main_image',
      'about_seo_title',
      'about_seo_description',
      'treatments_seo_title',
      'treatments_seo_description',
      'treatments_banner_image',
    ]

    for (const key of keys) {
      try {
        app.findFirstRecordByData('site_settings', 'key', key)
      } catch (_) {
        const record = new Record(col)
        record.set('key', key)
        record.set('value', '')
        app.save(record)
      }
    }
  },
  (app) => {
    const keys = [
      'home_hero_image',
      'home_seo_title',
      'home_seo_description',
      'about_main_image',
      'about_seo_title',
      'about_seo_description',
      'treatments_seo_title',
      'treatments_seo_description',
      'treatments_banner_image',
    ]
    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
