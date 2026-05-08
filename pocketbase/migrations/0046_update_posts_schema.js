migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('posts')

    col.fields.add(new DateField({ name: 'published_at', required: false }))
    col.fields.add(new TextField({ name: 'image_alt', required: false }))

    col.listRule = "@request.auth.is_admin = true || (status = 'published' && published_at <= @now)"
    col.viewRule = "@request.auth.is_admin = true || (status = 'published' && published_at <= @now)"

    app.save(col)

    col.addIndex('idx_posts_published_at', false, 'published_at', '')
    app.save(col)

    app
      .db()
      .newQuery(
        "UPDATE posts SET published_at = created WHERE published_at = '' OR published_at IS NULL",
      )
      .execute()
  },
  (app) => {
    const col = app.findCollectionByNameOrId('posts')
    col.fields.removeByName('published_at')
    col.fields.removeByName('image_alt')
    col.removeIndex('idx_posts_published_at')
    col.listRule = ''
    col.viewRule = ''
    app.save(col)
  },
)
