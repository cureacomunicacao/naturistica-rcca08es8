migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('is_admin')) {
      users.fields.add(new BoolField({ name: 'is_admin' }))
      app.save(users)
    }

    try {
      const adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'cureacomunicacao@gmail.com')
      adminUser.set('is_admin', true)
      app.save(adminUser)
    } catch (_) {}

    const adminCollections = ['treatments', 'posts', 'testimonials', 'faqs', 'site_settings']
    for (const name of adminCollections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.createRule = '@request.auth.is_admin = true'
        col.updateRule = '@request.auth.is_admin = true'
        col.deleteRule = '@request.auth.is_admin = true'
        app.save(col)
      } catch (_) {}
    }

    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.listRule = '@request.auth.is_admin = true'
      leads.viewRule = '@request.auth.is_admin = true'
      leads.updateRule = '@request.auth.is_admin = true'
      leads.deleteRule = '@request.auth.is_admin = true'
      app.save(leads)
    } catch (_) {}
  },
  (app) => {
    const adminCollections = ['treatments', 'posts', 'testimonials', 'faqs', 'site_settings']
    for (const name of adminCollections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.createRule = "@request.auth.id != ''"
        col.updateRule = "@request.auth.id != ''"
        col.deleteRule = "@request.auth.id != ''"
        app.save(col)
      } catch (_) {}
    }

    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.listRule = "@request.auth.id != ''"
      leads.viewRule = "@request.auth.id != ''"
      leads.updateRule = "@request.auth.id != ''"
      leads.deleteRule = "@request.auth.id != ''"
      app.save(leads)
    } catch (_) {}

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (users.fields.getByName('is_admin')) {
      users.fields.removeByName('is_admin')
      app.save(users)
    }
  },
)
