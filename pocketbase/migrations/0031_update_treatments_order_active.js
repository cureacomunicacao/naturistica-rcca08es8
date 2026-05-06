migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('treatments')

    if (!col.fields.getByName('order')) {
      col.fields.add(new NumberField({ name: 'order' }))
    }
    if (!col.fields.getByName('active')) {
      col.fields.add(new BoolField({ name: 'active' }))
    }

    col.addIndex('idx_treatments_order', false, 'order', '')
    app.save(col)

    app.db().newQuery('UPDATE treatments SET active = 1, `order` = 0').execute()
  },
  (app) => {
    const col = app.findCollectionByNameOrId('treatments')
    col.removeIndex('idx_treatments_order')
    col.fields.removeByName('order')
    col.fields.removeByName('active')
    app.save(col)
  },
)
