migrate(
  (app) => {
    const collection = new Collection({
      name: 'analytics_events',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'event_type', type: 'text', required: true },
        { name: 'path', type: 'text', required: true },
        { name: 'label', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_analytics_event_type ON analytics_events (event_type)',
        'CREATE INDEX idx_analytics_created ON analytics_events (created DESC)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('analytics_events')
    app.delete(collection)
  },
)
