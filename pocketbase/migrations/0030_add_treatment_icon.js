migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('treatments')
    collection.fields.add(
      new FileField({
        name: 'icon',
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'],
      }),
    )
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('treatments')
    collection.fields.removeByName('icon')
    app.save(collection)
  },
)
