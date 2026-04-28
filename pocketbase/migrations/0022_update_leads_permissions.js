migrate((app) => {
  const col = app.findCollectionByNameOrId('leads')
  col.listRule = '@request.auth.is_admin = true'
  col.viewRule = '@request.auth.is_admin = true'
  col.createRule = ''
  col.updateRule = '@request.auth.is_admin = true'
  col.deleteRule = '@request.auth.is_admin = true'
  app.save(col)
})
