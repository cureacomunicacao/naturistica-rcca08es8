migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('treatments')
    col.fields.add(new TextField({ name: 'image_alt' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('treatments')
    col.fields.removeByName('image_alt')
    app.save(col)
  },
)
