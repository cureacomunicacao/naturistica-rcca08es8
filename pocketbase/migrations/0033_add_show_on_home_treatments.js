migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('treatments')
    if (!col.fields.getByName('show_on_home')) {
      col.fields.add(new BoolField({ name: 'show_on_home' }))
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('treatments')
    col.fields.removeByName('show_on_home')
    app.save(col)
  },
)
