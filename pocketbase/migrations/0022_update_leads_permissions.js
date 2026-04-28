migrate((app) => {
  const col = app.findCollectionByNameOrId('site_settings')
  try {
    app.findFirstRecordByData('site_settings', 'key', 'whatsapp_contact_number')
  } catch (_) {
    const record = new Record(col)
    record.set('key', 'whatsapp_contact_number')
    record.set('value', '5511999999999')
    app.save(record)
  }
})
