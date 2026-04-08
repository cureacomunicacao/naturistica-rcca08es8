migrate(
  (app) => {
    const treatments = app.findCollectionByNameOrId('treatments')
    try {
      app.findFirstRecordByData('treatments', 'slug', 'autismo')
    } catch (_) {
      const record = new Record(treatments)
      record.set('title', 'Autismo')
      record.set('slug', 'autismo')
      record.set(
        'content',
        '<p>Abordagem integrada e sensível para o autismo, focando no bem-estar, regulação emocional e desenvolvimento com ferramentas naturais e suporte contínuo.</p>',
      )
      record.set('seo_title', 'Autismo | Tratamentos Naturistica')
      record.set(
        'seo_description',
        'Descubra como apoiamos o autismo através de nossa medicina integrativa na Naturistica.',
      )
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('treatments', 'slug', 'autismo')
      app.delete(record)
    } catch (_) {}
  },
)
