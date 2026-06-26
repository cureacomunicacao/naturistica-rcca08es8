migrate(
  (app) => {
    const collection = new Collection({
      name: 'page_sections',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '@request.auth.is_admin = true',
      updateRule: '@request.auth.is_admin = true',
      deleteRule: '@request.auth.is_admin = true',
      fields: [
        { name: 'page_slug', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          values: ['hero', 'list', 'side_image_right', 'side_image_left', 'video', 'cards'],
          required: true,
        },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'editor' },
        { name: 'content', type: 'json' },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
        },
        { name: 'video_url', type: 'url' },
        { name: 'button_text', type: 'text' },
        { name: 'button_link', type: 'text' },
        { name: 'background_color', type: 'text' },
        { name: 'text_color', type: 'text' },
        { name: 'padding_y', type: 'number' },
        { name: 'order', type: 'number' },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_page_sections_page_slug ON page_sections (page_slug)',
        'CREATE INDEX idx_page_sections_order ON page_sections (`order`)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('page_sections')
    app.delete(collection)
  },
)
