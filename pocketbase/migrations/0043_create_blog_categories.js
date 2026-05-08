migrate(
  (app) => {
    const collection = new Collection({
      name: 'blog_categories',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.is_admin = true',
      updateRule: '@request.auth.is_admin = true',
      deleteRule: '@request.auth.is_admin = true',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_blog_categories_slug ON blog_categories (slug)'],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('blog_categories')
      app.delete(collection)
    } catch (_) {}
  },
)
