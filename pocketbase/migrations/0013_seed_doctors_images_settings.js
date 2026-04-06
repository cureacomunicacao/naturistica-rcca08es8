migrate(
  (app) => {
    const settings = app.findCollectionByNameOrId('site_settings')

    const keys = [
      'about_doctor_felipe_image',
      'about_doctor_beatriz_image',
      'about_beatriz_title',
      'about_beatriz_content',
    ]

    for (const key of keys) {
      try {
        app.findFirstRecordByData('site_settings', 'key', key)
      } catch (_) {
        const record = new Record(settings)
        record.set('key', key)
        app.save(record)
      }
    }
  },
  (app) => {
    // Safe down migration empty
  },
)
