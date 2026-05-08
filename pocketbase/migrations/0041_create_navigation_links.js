migrate(
  (app) => {
    const collection = new Collection({
      name: 'navigation_links',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.is_admin = true',
      updateRule: '@request.auth.is_admin = true',
      deleteRule: '@request.auth.is_admin = true',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'order', type: 'number' },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(collection)

    // Update Dr. Felipe's phone number
    try {
      const felipeSetting = app.findFirstRecordByData('site_settings', 'key', 'whatsapp_felipe')
      felipeSetting.set('value', '+55 43 9157-5911')
      app.save(felipeSetting)
    } catch (_) {
      const siteSettings = app.findCollectionByNameOrId('site_settings')
      const newRecord = new Record(siteSettings)
      newRecord.set('key', 'whatsapp_felipe')
      newRecord.set('value', '+55 43 9157-5911')
      app.save(newRecord)
    }
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('navigation_links')
    app.delete(collection)
  },
)
