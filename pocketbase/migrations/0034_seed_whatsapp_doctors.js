migrate((app) => {
  const settings = app.findCollectionByNameOrId('site_settings')

  const ensureSetting = (key, value) => {
    try {
      app.findFirstRecordByData('site_settings', 'key', key)
    } catch (_) {
      const record = new Record(settings)
      record.set('key', key)
      record.set('value', value)
      app.save(record)
    }
  }

  ensureSetting(
    'whatsapp_felipe',
    'https://wa.me/5543991692047?text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Felipe.',
  )
  ensureSetting(
    'whatsapp_beatriz',
    'https://wa.me/5543991692047?text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20consulta%20com%20a%20Dra.%20Beatriz.',
  )
})
