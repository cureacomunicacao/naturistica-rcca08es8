migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')
    col.fields.add(new TextField({ name: 'image_alt' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('site_settings')
    col.fields.removeByName('image_alt')
    app.save(col)
  },
)
