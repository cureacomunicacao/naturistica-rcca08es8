migrate(
  (app) => {
    const navLinksCol = app.findCollectionByNameOrId('navigation_links')
    const links = [
      { label: 'Início', href: '/', order: 1, active: true },
      { label: 'Sobre', href: '/sobre', order: 2, active: true },
      { label: 'Tratamentos', href: '/tratamentos', order: 3, active: true },
      { label: 'Blog', href: '/blog', order: 4, active: true },
      { label: 'Contato', href: '/contato', order: 5, active: true },
    ]
    for (const link of links) {
      try {
        app.findFirstRecordByData('navigation_links', 'href', link.href)
      } catch (_) {
        const record = new Record(navLinksCol)
        record.set('label', link.label)
        record.set('href', link.href)
        record.set('order', link.order)
        record.set('active', link.active)
        app.save(record)
      }
    }
  },
  (app) => {
    const links = app.findRecordsByFilter('navigation_links', '1=1', '', 100, 0)
    for (const link of links) {
      app.delete(link)
    }
  },
)
