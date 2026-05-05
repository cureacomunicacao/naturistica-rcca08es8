migrate((app) => {
  const testimonials = [
    {
      patient_name: 'Mariana F. Torres',
      doctor: 'Felipe',
      content:
        'Encontrei no Dr. Felipe um acolhimento raro. O tratamento integrado mudou minha forma de lidar com o estresse do dia a dia.',
      active: true,
    },
    {
      patient_name: 'Jhulia A. Silva',
      doctor: 'Felipe',
      content:
        'A visão ancestral combinada com a medicina moderna me trouxe uma clareza que eu buscava há anos na terapia convencional.',
      active: true,
    },
    {
      patient_name: 'Rafael M. Jotta',
      doctor: 'Felipe',
      content:
        'Profissionalismo e empatia. O acompanhamento contínuo fez toda a diferença na minha recuperação do burnout.',
      active: true,
    },
    {
      patient_name: 'Lavinia Moreira',
      doctor: 'Beatriz',
      content:
        'A Dra. Beatriz tem uma escuta atenta e profunda. Senti que finalmente fui compreendida em minhas questões de insônia crônica.',
      active: true,
    },
    {
      patient_name: 'Fernanda Garmatter',
      doctor: 'Beatriz',
      content:
        'O tratamento com cannabis medicinal conduzido de forma tão ética me devolveu a qualidade de vida. Gratidão imensa.',
      active: true,
    },
    {
      patient_name: 'Luiz Carlos Bassetto',
      doctor: 'Beatriz',
      content:
        'Uma abordagem que respeita o tempo do paciente. A integração com Ayurveda foi um divisor de águas na minha saúde.',
      active: true,
    },
  ]

  const collection = app.findCollectionByNameOrId('testimonials')

  for (const t of testimonials) {
    try {
      app.findFirstRecordByData('testimonials', 'patient_name', t.patient_name)
    } catch (_) {
      const record = new Record(collection)
      record.set('patient_name', t.patient_name)
      record.set('doctor', t.doctor)
      record.set('content', t.content)
      record.set('active', t.active)
      app.save(record)
    }
  }
})
