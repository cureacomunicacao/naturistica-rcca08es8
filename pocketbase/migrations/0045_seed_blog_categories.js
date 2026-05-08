migrate(
  (app) => {
    const cats = [
      { name: 'Saúde Mental', slug: 'saude-mental' },
      { name: 'Cannabis Medicinal', slug: 'cannabis-medicinal' },
      { name: 'Bem-estar', slug: 'bem-estar' },
    ]

    const blogCats = app.findCollectionByNameOrId('blog_categories')
    const catMap = {}

    for (const c of cats) {
      try {
        const existing = app.findFirstRecordByData('blog_categories', 'slug', c.slug)
        catMap[c.name] = existing.id
      } catch (_) {
        const record = new Record(blogCats)
        record.set('name', c.name)
        record.set('slug', c.slug)
        app.save(record)
        catMap[c.name] = record.id
      }
    }

    const posts = app.findRecordsByFilter('posts', "category != ''", '', 1000, 0)
    for (const post of posts) {
      const catName = post.getString('category').trim()
      let targetCatId = null
      const matched = Object.keys(catMap).find((k) => k.toLowerCase() === catName.toLowerCase())

      if (matched) {
        targetCatId = catMap[matched]
      } else {
        const slug = catName
          .toLowerCase()
          .replace(/[\s_]+/g, '-')
          .replace(/[^\w-]/g, '')
        try {
          const existing = app.findFirstRecordByData('blog_categories', 'slug', slug)
          targetCatId = existing.id
          catMap[catName] = targetCatId
        } catch (_) {
          try {
            const newCat = new Record(blogCats)
            newCat.set('name', catName)
            newCat.set('slug', slug)
            app.save(newCat)
            targetCatId = newCat.id
            catMap[catName] = targetCatId
          } catch (_) {}
        }
      }

      if (targetCatId) {
        post.set('category_ref', targetCatId)
        app.save(post)
      }
    }
  },
  (app) => {},
)
