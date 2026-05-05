migrate((app) => {
  const col = app.findCollectionByNameOrId('testimonials')

  const seeds = [
    {
      patient_name: 'Mariana F. Torres',
      doctor: 'Felipe',
      content:
        'Encontrei no Dr. Felipe um acolhimento raro. O tratamento integrado mudou minha forma de lidar com o estresse do dia a dia.',
    },
    {
      patient_name: 'Jhulia A. Silva',
      doctor: 'Felipe',
      content:
        'A visão ancestral combinada com a medicina moderna me trouxe uma clareza que eu buscava há anos na terapia convencional.',
    },
    {
      patient_name: 'Rafael M. Jotta',
      doctor: 'Felipe',
      content:
        'Profissionalismo e empatia. O acompanhamento contínuo fez toda a diferença na minha recuperação do burnout.',
    },
    {
      patient_name: 'Lavinia Moreira',
      doctor: 'Beatriz',
      content:
        'A Dra. Beatriz tem uma escuta atenta e profunda. Senti que finalmente fui compreendida em minhas questões de insônia crônica.',
    },
    {
      patient_name: 'Fernanda Garmatter',
      doctor: 'Beatriz',
      content:
        'O tratamento com cannabis medicinal conduzido de forma tão ética me devolveu a qualidade de vida. Gratidão imensa.',
    },
    {
      patient_name: 'Luiz Carlos Bassetto',
      doctor: 'Beatriz',
      content:
        'Uma abordagem que respeita o tempo do paciente. A integração com Ayurveda foi um divisor de águas na minha saúde.',
    },
  ]

  for (const item of seeds) {
    try {
      app.findFirstRecordByData('testimonials', 'content', item.content)
    } catch (_) {
      const record = new Record(col)
      record.set('patient_name', item.patient_name)
      record.set('doctor', item.doctor)
      record.set('content', item.content)
      record.set('active', true)
      app.save(record)
    }
  }
})
