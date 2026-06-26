migrate(
  (app) => {
    app
      .db()
      .newQuery(`
    UPDATE page_sections
    SET image = 'https://img.usecurling.com/p/800/600?q=integrative%20health&color=green'
    WHERE active = 1 AND (image = '' OR image IS NULL) AND type IN ('hero', 'side_image_right', 'side_image_left', 'cards')
  `)
      .execute()
  },
  (app) => {
    // No safe down migration possible for mass data updates
  },
)
