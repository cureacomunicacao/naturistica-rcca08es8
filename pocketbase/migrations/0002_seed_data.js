migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'cureacomunicacao@gmail.com')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('cureacomunicacao@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }

    const treatments = app.findCollectionByNameOrId('treatments')
    const initialTreatments = [
      {
        title: 'Ansiedade',
        slug: 'ansiedade',
        content:
          '<p>O tratamento para ansiedade foca em equilibrar o sistema nervoso, utilizando abordagens integrativas que unem ciência e ancestralidade. Buscamos entender a raiz emocional e fisiológica dos sintomas para promover um bem-estar duradouro.</p>',
      },
      {
        title: 'Insônia',
        slug: 'insonia',
        content:
          '<p>A insônia é muitas vezes reflexo de um corpo e mente desconectados de seus ritmos naturais. Nosso acompanhamento visa restaurar o ciclo circadiano, utilizando ferramentas como higiene do sono, fitoterapia e cannabis medicinal quando indicado.</p>',
      },
      {
        title: 'Burnout',
        slug: 'burnout',
        content:
          '<p>O esgotamento crônico exige uma pausa estruturada e um plano de recuperação cuidadoso. Auxiliamos pacientes a reconstruírem sua vitalidade através de mudanças graduais no estilo de vida e suporte terapêutico profundo.</p>',
      },
      {
        title: 'TDAH',
        slug: 'tdah',
        content:
          '<p>Tratamos o TDAH com uma visão que vai além da medicação convencional. Integramos nutrição, Ayurveda e psicoterapia para apoiar o cérebro neurodivergente, ajudando a canalizar o foco e a energia de forma saudável e sustentável.</p>',
      },
      {
        title: 'Trauma',
        slug: 'trauma',
        content:
          '<p>A cura do trauma envolve resgatar a segurança no próprio corpo. Através de terapias focadas no corpo e abordagens guiadas por enteógenos (quando aplicável), criamos um espaço seguro para processar e integrar memórias dolorosas.</p>',
      },
      {
        title: 'Enxaqueca',
        slug: 'enxaqueca',
        content:
          '<p>Dores de cabeça crônicas frequentemente possuem gatilhos multifatoriais (alimentares, estresse, hormonais). Nossa investigação detalhada mapeia essas causas para propor tratamentos naturais e preventivos eficazes.</p>',
      },
      {
        title: 'Fibromialgia',
        slug: 'fibromialgia',
        content:
          '<p>A dor generalizada da fibromialgia requer um cuidado empático e abrangente. Combinamos modulação da dor, suporte emocional e estratégias anti-inflamatórias para devolver qualidade de vida aos pacientes.</p>',
      },
      {
        title: 'Dor crônica',
        slug: 'dor-cronica',
        content:
          '<p>Conviver com a dor não precisa ser o seu "novo normal". Abordamos a dor crônica entendendo a conexão mente-corpo, oferecendo tratamentos que buscam desinflamar e reequilibrar o organismo como um todo.</p>',
      },
    ]

    for (const t of initialTreatments) {
      try {
        app.findFirstRecordByData('treatments', 'slug', t.slug)
      } catch (_) {
        const record = new Record(treatments)
        record.set('title', t.title)
        record.set('slug', t.slug)
        record.set('content', t.content)
        record.set('seo_title', t.title + ' | Tratamentos Naturistica')
        record.set(
          'seo_description',
          'Descubra como tratamos ' +
            t.title.toLowerCase() +
            ' através da medicina integrativa na Naturistica.',
        )
        app.save(record)
      }
    }
  },
  (app) => {},
)
