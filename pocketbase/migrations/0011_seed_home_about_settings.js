migrate(
  (app) => {
    const settingsCol = app.findCollectionByNameOrId('site_settings')

    const seedSetting = (key, value, image_alt = '') => {
      try {
        app.findFirstRecordByData('site_settings', 'key', key)
      } catch (_) {
        const record = new Record(settingsCol)
        record.set('key', key)
        record.set('value', value)
        if (image_alt) record.set('image_alt', image_alt)
        app.save(record)
      }
    }

    seedSetting('home_hero', '', 'Natureza e serenidade')
    seedSetting('home_seo_title', 'Saúde & Consciência | Naturistica')
    seedSetting(
      'home_seo_description',
      'Naturistica: onde a ciência encontra a ancestralidade para saúde e consciência.',
    )

    seedSetting('about_main', '', 'Dra Beatriz e Dr Felipe')
    seedSetting(
      'about_content',
      'Nossa história começou nos corredores da Universidade Estadual de Londrina (UEL), onde a paixão pela medicina se encontrou com o desejo de ir além do tratamento de sintomas. Percebemos cedo que a medicina ocidental, embora brilhante em crises agudas, muitas vezes falhava em oferecer cura real para condições crônicas e sofrimentos da alma.\n\nA Naturistica nasceu da necessidade de unir o rigor científico da nossa formação com a sabedoria ancestral. Vimos pacientes peregrinarem por diversos especialistas sem encontrar alívio para ansiedade, insônia e dores crônicas.',
    )
    seedSetting('about_seo_title', 'Nossa História | Naturistica')
    seedSetting('about_seo_description', 'Conheça a história da Naturistica e nossos fundadores.')
  },
  (app) => {
    const keys = [
      'home_hero',
      'home_seo_title',
      'home_seo_description',
      'about_main',
      'about_content',
      'about_seo_title',
      'about_seo_description',
    ]
    keys.forEach((key) => {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    })
  },
)
