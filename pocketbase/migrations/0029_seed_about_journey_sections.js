migrate(
  (app) => {
    const settings = app.findCollectionByNameOrId('site_settings')

    const seeds = [
      { key: 'about_journey_s1_title', value: 'Nossa Origem' },
      {
        key: 'about_journey_s1_content',
        value:
          '<p>Nossa história começou nos corredores da Universidade Estadual de Londrina (UEL), onde a paixão pela medicina se encontrou com o desejo de ir além do tratamento de sintomas.</p>',
      },
      { key: 'about_journey_s1_image', value: '', image_alt: 'Universidade e estudos' },

      { key: 'about_journey_s2_title', value: 'O Nascimento da Naturistica' },
      {
        key: 'about_journey_s2_content',
        value:
          '<p>A Naturistica nasceu da necessidade de unir o rigor científico da nossa formação com a sabedoria ancestral, criando um espaço de cura integrativa focado no ser humano como um todo.</p>',
      },
      { key: 'about_journey_s2_image', value: '', image_alt: 'Espaço integrativo' },

      { key: 'about_journey_s3_title', value: 'Além dos Sintomas' },
      {
        key: 'about_journey_s3_content',
        value:
          '<p>Percebemos que o tratamento convencional muitas vezes apenas mascarava as raízes dos problemas. Nosso objetivo sempre foi investigar as causas profundas e emocionais de cada paciente.</p>',
      },
      { key: 'about_journey_s3_image', value: '', image_alt: 'Cuidado com o paciente' },

      { key: 'about_journey_s4_title', value: 'Medicinas Tradicionais' },
      {
        key: 'about_journey_s4_content',
        value:
          '<p>Decidimos buscar conhecimento nas medicinas tradicionais, incorporando práticas como Ayurveda e fitoterapia, que enxergam o indivíduo em sua totalidade sistêmica.</p>',
      },
      { key: 'about_journey_s4_image', value: '', image_alt: 'Plantas medicinais' },

      { key: 'about_journey_s5_title', value: 'Novas Perspectivas de Cura' },
      {
        key: 'about_journey_s5_content',
        value:
          '<p>O estudo aprofundado do uso de enteógenos e da medicina canabinoide nos trouxe ferramentas inovadoras e poderosas para transformações de vida consistentes.</p>',
      },
      { key: 'about_journey_s5_image', value: '', image_alt: 'Medicina canabinoide' },

      { key: 'about_journey_s6_title', value: 'O Nosso Propósito' },
      {
        key: 'about_journey_s6_content',
        value:
          '<p>Hoje, oferecemos um espaço seguro, acolhedor e fundamentado na ciência, guiando nossos pacientes para a autonomia e protagonismo de sua própria saúde.</p>',
      },
      { key: 'about_journey_s6_image', value: '', image_alt: 'Equipe Naturistica' },
    ]

    for (const s of seeds) {
      try {
        app.findFirstRecordByData('site_settings', 'key', s.key)
      } catch (_) {
        const record = new Record(settings)
        record.set('key', s.key)
        record.set('value', s.value)
        if (s.image_alt) record.set('image_alt', s.image_alt)
        app.save(record)
      }
    }
  },
  (app) => {
    const keys = []
    for (let i = 1; i <= 6; i++) {
      keys.push(
        `about_journey_s${i}_title`,
        `about_journey_s${i}_content`,
        `about_journey_s${i}_image`,
      )
    }
    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
