migrate(
  (app) => {
    const collections = ['posts', 'treatments']

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        const field = col.fields.getByName('content')
        if (field) {
          // Expand max size to 5MB to ensure large articles can be saved safely
          field.maxSize = 5242880
          col.fields.add(field)
          app.save(col)
        }
      } catch (err) {
        // Collection might not exist in some states, skip safely
      }
    }
  },
  (app) => {
    const collections = ['posts', 'treatments']

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        const field = col.fields.getByName('content')
        if (field) {
          field.maxSize = 0 // Revert to default
          col.fields.add(field)
          app.save(col)
        }
      } catch (err) {
        // Skip
      }
    }
  },
)
