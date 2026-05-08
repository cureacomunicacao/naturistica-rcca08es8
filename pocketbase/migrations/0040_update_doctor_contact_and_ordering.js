migrate(
  (app) => {
    const settings = app.findCollectionByNameOrId('site_settings')

    // Update Felipe's WhatsApp
    try {
      const felipe = app.findFirstRecordByData('site_settings', 'key', 'whatsapp_felipe')
      felipe.set('value', '554391575911')
      app.save(felipe)
    } catch (_) {
      const felipe = new Record(settings)
      felipe.set('key', 'whatsapp_felipe')
      felipe.set('value', '554391575911')
      app.save(felipe)
    }

    // Update Beatriz's WhatsApp (ensure it exists)
    try {
      const beatriz = app.findFirstRecordByData('site_settings', 'key', 'whatsapp_beatriz')
      beatriz.set('value', '5543991692047')
      app.save(beatriz)
    } catch (_) {
      const beatriz = new Record(settings)
      beatriz.set('key', 'whatsapp_beatriz')
      beatriz.set('value', '5543991692047')
      app.save(beatriz)
    }
  },
  (app) => {
    try {
      const felipe = app.findFirstRecordByData('site_settings', 'key', 'whatsapp_felipe')
      felipe.set('value', '554391575911')
      app.save(felipe)
    } catch (_) {}
  },
)
