migrate(
  (app) => {
    const settings = [
      // Global
      { key: 'global_cta_text', value: 'Agendar consulta online' },
      { key: 'global_cta_link', value: 'https://wa.me/5511999999999' },

      // Home
      { key: 'home_hero_btn1_text', value: 'Agendar consulta online' },
      { key: 'home_hero_btn1_link', value: 'https://wa.me/5511999999999' },
      { key: 'home_hero_btn2_text', value: 'Conheça nossa história' },
      { key: 'home_hero_btn2_link', value: '/sobre' },
      { key: 'expectations_button_link', value: 'https://wa.me/5511999999999' },
      {
        key: 'home_philosophy_title',
        value:
          'A saúde em que acreditamos: <br /><span class="italic font-normal text-primary">retorno ao o que você já é</span>',
      },
      {
        key: 'home_philosophy_text',
        value:
          '<p>Acreditamos que a verdadeira saúde não é a ausência de doenças, mas um estado de profundo alinhamento entre corpo, mente e natureza. Nossa abordagem rompe com a visão fragmentada da medicina tradicional.</p><p>Ao unir os conhecimentos milenares da Ayurveda e do uso ritualístico de plantas professoras com o rigor da ciência moderna, buscamos ir à raiz do seu sofrimento.</p><p>O fim da separação mente-corpo é o início da sua cura. Nós guiamos você nesse caminho de volta para casa, para a sua essência mais pura e equilibrada.</p>',
      },
      { key: 'home_testimonials_title', value: 'Conheça histórias de alguns de nossos pacientes' },
      { key: 'home_blog_title', value: 'Nosso Blog' },
      {
        key: 'home_blog_desc',
        value: 'Artigos, reflexões e informações sobre saúde integrativa e terapias naturais.',
      },
      { key: 'home_blog_btn_text', value: 'Ver todos os artigos' },
      { key: 'home_blog_btn_link', value: '/blog' },

      // Treatments
      { key: 'treatments_banner_title', value: 'Tratamentos Integrativos' },
      { key: 'treatments_banner_subtitle', value: '"Tratamos a causa, não apenas os sintomas."' },
      { key: 'treatments_grid_title', value: 'Áreas de Atuação' },
      { key: 'treatments_testim_title', value: 'Histórias de Transformação' },
      {
        key: 'treatments_testim_desc',
        value:
          'Relatos de pacientes que reencontraram o equilíbrio e bem-estar através do cuidado integrativo.',
      },

      // About
      { key: 'about_hero_title', value: 'Nossa História' },
      {
        key: 'about_hero_subtitle',
        value: 'Da ciência moderna à sabedoria ancestral para uma saúde integral.',
      },
      { key: 'about_faq_title', value: 'Perguntas Frequentes' },
      { key: 'about_cta_title', value: 'Inicie sua jornada de cura' },
      {
        key: 'about_cta_desc',
        value:
          'Agende sua consulta e dê o primeiro passo para uma vida com mais saúde, consciência e bem-estar com a equipe Naturistica.',
      },

      // Contact
      { key: 'contact_hero_title', value: 'Fale Conosco' },
      {
        key: 'contact_hero_desc',
        value:
          'Dê o primeiro passo para o seu bem-estar. Preencha o formulário abaixo e nossa equipe entrará em contato com você pelo WhatsApp.',
      },
      { key: 'contact_form_title', value: 'Envie sua mensagem' },
      { key: 'contact_info_title', value: 'Informações de Contato' },
      {
        key: 'contact_info_desc',
        value:
          'Estamos prontos para atender você com o maior cuidado e profissionalismo. Entre em contato pelos nossos canais diretos.',
      },
      { key: 'contact_hours', value: 'Segunda a Sexta, das 8h às 18h' },
      { key: 'contact_benefits_title', value: 'Por que escolher a Naturistica?' },
      { key: 'contact_benefit1_title', value: 'Atendimento Humanizado' },
      {
        key: 'contact_benefit1_desc',
        value: 'Ouvimos você de verdade, com consultas longas e focadas na raiz do problema.',
      },
      { key: 'contact_benefit2_title', value: 'Suporte Contínuo' },
      {
        key: 'contact_benefit2_desc',
        value: 'Acompanhamento próximo via WhatsApp durante todo o tratamento.',
      },
      { key: 'contact_benefit3_title', value: '100% Online' },
      {
        key: 'contact_benefit3_desc',
        value: 'Consultas e retornos sem precisar sair de casa, com segurança e praticidade.',
      },
    ]

    const col = app.findCollectionByNameOrId('site_settings')

    for (const s of settings) {
      try {
        app.findFirstRecordByData('site_settings', 'key', s.key)
      } catch (_) {
        const record = new Record(col)
        record.set('key', s.key)
        record.set('value', s.value)
        app.save(record)
      }
    }
  },
  (app) => {
    const keys = [
      'global_cta_text',
      'global_cta_link',
      'home_hero_btn1_text',
      'home_hero_btn1_link',
      'home_hero_btn2_text',
      'home_hero_btn2_link',
      'expectations_button_link',
      'home_philosophy_title',
      'home_philosophy_text',
      'home_testimonials_title',
      'home_blog_title',
      'home_blog_desc',
      'home_blog_btn_text',
      'home_blog_btn_link',
      'treatments_banner_title',
      'treatments_banner_subtitle',
      'treatments_grid_title',
      'treatments_testim_title',
      'treatments_testim_desc',
      'about_hero_title',
      'about_hero_subtitle',
      'about_faq_title',
      'about_cta_title',
      'about_cta_desc',
      'contact_hero_title',
      'contact_hero_desc',
      'contact_form_title',
      'contact_info_title',
      'contact_info_desc',
      'contact_hours',
      'contact_benefits_title',
      'contact_benefit1_title',
      'contact_benefit1_desc',
      'contact_benefit2_title',
      'contact_benefit2_desc',
      'contact_benefit3_title',
      'contact_benefit3_desc',
    ]
    for (const key of keys) {
      try {
        const record = app.findFirstRecordByData('site_settings', 'key', key)
        app.delete(record)
      } catch (_) {}
    }
  },
)
