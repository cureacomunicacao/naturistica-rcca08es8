migrate((app) => {
  const collection = app.findCollectionByNameOrId('treatments')

  const treatmentsToSet = [
    { title: 'Enxaqueca', slug: 'enxaqueca', order: 10 },
    { title: 'TDAH', slug: 'tdah', order: 20 },
    { title: 'Trauma', slug: 'trauma', order: 30 },
    { title: 'Ansiedade', slug: 'ansiedade', order: 40 },
    { title: 'Redução de danos', slug: 'reducao-de-danos', order: 50 },
    { title: 'Insônia', slug: 'insonia', order: 60 },
    { title: 'Burnout', slug: 'burnout', order: 70 },
    { title: 'Estresse crônico', slug: 'estresse-cronico', order: 80 },
  ]

  for (const t of treatmentsToSet) {
    try {
      const record = app.findFirstRecordByData('treatments', 'slug', t.slug)
      record.set('order', t.order)
      record.set('active', true)
      record.set('show_on_home', true)
      app.save(record)
    } catch (_) {
      const record = new Record(collection)
      record.set('title', t.title)
      record.set('slug', t.slug)
      record.set('order', t.order)
      record.set('active', true)
      record.set('show_on_home', true)
      app.save(record)
    }
  }
})
