migrate(
  (app) => {
    const siteSettings = app.findCollectionByNameOrId('site_settings')

    // Update Dr. Felipe's WhatsApp
    try {
      const felipeSetting = app.findFirstRecordByData('site_settings', 'key', 'whatsapp_felipe')
      felipeSetting.set('value', 'https://wa.me/554391575911')
      app.save(felipeSetting)
    } catch (_) {
      const record = new Record(siteSettings)
      record.set('key', 'whatsapp_felipe')
      record.set('value', 'https://wa.me/554391575911')
      app.save(record)
    }

    // Create main_menu_order
    try {
      app.findFirstRecordByData('site_settings', 'key', 'main_menu_order')
    } catch (_) {
      const record = new Record(siteSettings)
      record.set('key', 'main_menu_order')
      record.set('value', 'home,sobre,tratamentos,contato,blog')
      app.save(record)
    }

    // Ensure Dr. Beatriz's WhatsApp exists
    try {
      app.findFirstRecordByData('site_settings', 'key', 'whatsapp_beatriz')
    } catch (_) {
      const record = new Record(siteSettings)
      record.set('key', 'whatsapp_beatriz')
      record.set('value', 'https://wa.me/5543991692047')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('site_settings', 'key', 'main_menu_order')
      app.delete(record)
    } catch (_) {}

    try {
      const felipeSetting = app.findFirstRecordByData('site_settings', 'key', 'whatsapp_felipe')
      // Restore default/old number for down migration
      felipeSetting.set('value', 'https://wa.me/5543991692047')
      app.save(felipeSetting)
    } catch (_) {}
  },
)
