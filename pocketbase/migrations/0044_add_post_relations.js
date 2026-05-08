migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId('posts')
    const blogCats = app.findCollectionByNameOrId('blog_categories')

    posts.fields.add(
      new RelationField({
        name: 'category_ref',
        collectionId: blogCats.id,
        maxSelect: 1,
        cascadeDelete: false,
      }),
    )
    app.save(posts)

    const postImages = new Collection({
      name: 'post_images',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.is_admin = true',
      updateRule: '@request.auth.is_admin = true',
      deleteRule: '@request.auth.is_admin = true',
      fields: [
        {
          name: 'post_ref',
          type: 'relation',
          required: true,
          collectionId: posts.id,
          maxSelect: 1,
          cascadeDelete: true,
        },
        {
          name: 'image',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
        },
        { name: 'alt_text', type: 'text' },
        { name: 'sort_order', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(postImages)
  },
  (app) => {
    try {
      const postImages = app.findCollectionByNameOrId('post_images')
      app.delete(postImages)
    } catch (_) {}

    try {
      const posts = app.findCollectionByNameOrId('posts')
      posts.fields.removeByName('category_ref')
      app.save(posts)
    } catch (_) {}
  },
)
