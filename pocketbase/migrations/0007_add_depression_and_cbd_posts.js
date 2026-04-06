migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId('posts')

    const newPosts = [
      {
        title: 'Sintomas de Ansiedade Grave: Como Reconhecer e Tratar Urgente',
        slug: 'sintomas-ansiedade-grave',
        category: 'ANSIEDADE GRAVE',
        content:
          '<p>A ansiedade grave é uma condição debilitante que vai muito além do nervosismo comum do dia a dia. Quando não tratada, pode evoluir para crises de pânico, isolamento social e prejuízos significativos na qualidade de vida.</p><h2>Sintomas Físicos e Psicológicos</h2><p>Os sintomas de ansiedade grave frequentemente incluem taquicardia constante, falta de ar, sudorese excessiva, tremores e uma sensação iminente de desastre. Psicologicamente, a pessoa pode experimentar pensamentos obsessivos, medo constante de perder o controle e dificuldade extrema de concentração.</p><h2>Quando buscar ajuda urgente?</h2><p>É fundamental procurar tratamento quando a ansiedade impede a realização de tarefas diárias, afeta o sono ou causa sofrimento intenso. A Naturística oferece abordagens integrativas que combinam psicoterapia, ajustes no estilo de vida e, quando necessário, intervenções médicas seguras para estabilizar os sintomas rapidamente.</p><p>Não espere a situação se agravar. O tratamento precoce é a chave para recuperar a tranquilidade e a qualidade de vida. Nossa equipe está preparada para acolher você de forma humanizada, entendendo suas necessidades específicas e traçando um plano de cuidado personalizado.</p>',
        seo_title: 'Sintomas de Ansiedade Grave: Reconheça e Trate',
        seo_description:
          'Entenda os sinais da ansiedade grave e saiba quando e como buscar ajuda urgente para recuperar sua qualidade de vida.',
        status: 'published',
      },
      {
        title: 'Depressão e Ansiedade Juntas: Estratégias para Superar Ambas',
        slug: 'depressao-ansiedade-juntas',
        category: 'SAÚDE MENTAL',
        content:
          '<p>A coexistência de depressão e ansiedade é incrivelmente comum e apresenta um desafio único. Enquanto a ansiedade pode deixar a pessoa em constante estado de alerta, a depressão drena a energia, criando um ciclo exaustivo de inquietação e apatia.</p><h2>Compreendendo o Ciclo</h2><p>Muitas vezes, a ansiedade crônica não tratada pode levar à depressão devido ao esgotamento mental prolongado. Da mesma forma, os sentimentos de desesperança da depressão podem gerar ansiedade sobre o futuro. Reconhecer que ambas estão presentes é o primeiro passo para um tratamento eficaz.</p><h2>Estratégias Integrativas</h2><p>O tratamento simultâneo requer uma abordagem multifacetada. A Naturística utiliza protocolos que podem incluir fitoterapia avançada, práticas de regulação do sistema nervoso, e acompanhamento psicológico focado em quebrar o ciclo de retroalimentação entre as duas condições.</p><p>Acreditamos que o corpo e a mente devem ser tratados como um só. Nossas estratégias visam restaurar o equilíbrio neuroquímico e emocional, proporcionando alívio sustentável e devolvendo o controle da sua vida.</p>',
        seo_title: 'Depressão e Ansiedade Juntas: Como Tratar',
        seo_description:
          'Descubra estratégias eficazes para lidar com o diagnóstico duplo de ansiedade e depressão através da medicina integrativa.',
        status: 'published',
      },
      {
        title: 'CBD para Ansiedade e Depressão',
        slug: 'cbd-ansiedade-depressao',
        category: 'CANNABIS MEDICINAL',
        content:
          '<p>O Canabidiol (CBD) tem despontado como uma ferramenta terapêutica revolucionária no manejo de transtornos mentais, oferecendo uma alternativa natural com perfil de efeitos colaterais frequentemente mais brando que as medicações convencionais.</p><h2>Como o CBD atua no cérebro</h2><p>O CBD interage com o sistema endocanabinoide do corpo, ajudando a regular o humor, o sono e a resposta ao estresse. Ele atua em receptores de serotonina, promovendo efeitos ansiolíticos e antidepressivos que podem ser sentidos em poucas semanas de uso contínuo.</p><h2>A Abordagem da Naturística</h2><p>Na Naturística, a prescrição de Cannabis Medicinal é feita de forma ética, legal e altamente individualizada. Avaliamos o perfil de cada paciente para determinar a dosagem e a formulação ideais, acompanhando de perto a evolução clínica e ajustando o tratamento conforme necessário para garantir os melhores resultados possíveis.</p>',
        seo_title: 'CBD no Tratamento de Ansiedade e Depressão',
        seo_description:
          'Entenda como o Canabidiol (CBD) pode ser um aliado natural e eficaz no tratamento da ansiedade e da depressão.',
        status: 'published',
      },
      {
        title: 'Sintomas Físicos de Depressão: O Que o Corpo Revela Primeiro',
        slug: 'sintomas-fisicos-depressao',
        category: 'DEPRESSÃO',
        content:
          '<p>A depressão é frequentemente vista apenas como uma doença da mente, marcada por tristeza profunda. No entanto, o corpo muitas vezes sinaliza o sofrimento muito antes que os sintomas emocionais se tornem evidentes.</p><h2>Sinais de Alerta no Corpo</h2><p>Dores crônicas sem causa aparente, problemas digestivos persistentes, alterações extremas no apetite e fadiga esmagadora são manifestações físicas comuns da depressão. A conexão mente-corpo é tão forte que o estresse emocional contínuo se traduz em inflamação e desregulação física.</p><h2>A Importância da Escuta do Corpo</h2><p>Ignorar esses sinais pode atrasar o diagnóstico e o tratamento. Na Naturística, realizamos uma avaliação integrativa completa, ouvindo o que seu corpo tem a dizer. Tratamos não apenas a mente, mas buscamos desinflamar o organismo e restaurar a vitalidade física perdida, compreendendo que a verdadeira cura passa pela harmonização de todo o sistema.</p>',
        seo_title: 'Sintomas Físicos da Depressão: Sinais do Corpo',
        seo_description:
          'Aprenda a identificar os sintomas físicos que podem indicar um quadro de depressão antes mesmo dos sinais emocionais.',
        status: 'published',
      },
      {
        title: 'Teste de Depressão Gratuito: Avalie Sintomas Masculinos/Femininos',
        slug: 'teste-depressao-gratuito',
        category: 'DEPRESSÃO',
        content:
          '<p>A depressão pode se manifestar de maneiras diferentes em homens e mulheres. Enquanto as mulheres frequentemente relatam tristeza, culpa e fadiga, os homens podem apresentar irritabilidade, raiva e comportamentos de risco como sinais da doença.</p><h2>Por que fazer uma autoavaliação?</h2><p>Reconhecer os sintomas é o primeiro passo para a recuperação. Este teste interativo foi desenvolvido para ajudar você a refletir sobre como tem se sentido recentemente, considerando as nuances de gênero na manifestação da depressão.</p><p>Responda às perguntas a seguir com sinceridade. Lembre-se: nenhum teste online substitui uma avaliação médica profissional. Use isso como um ponto de partida para entender melhor sua saúde mental.</p>',
        seo_title: 'Teste de Depressão Gratuito Online',
        seo_description:
          'Faça nosso teste online gratuito para avaliar sintomas de depressão, considerando as diferentes manifestações em homens e mulheres.',
        status: 'published',
      },
    ]

    for (const postData of newPosts) {
      try {
        app.findFirstRecordByData('posts', 'slug', postData.slug)
      } catch (_) {
        const record = new Record(posts)
        Object.keys(postData).forEach((key) => {
          record.set(key, postData[key])
        })
        app.save(record)
      }
    }
  },
  (app) => {
    const slugs = [
      'sintomas-ansiedade-grave',
      'depressao-ansiedade-juntas',
      'cbd-ansiedade-depressao',
      'sintomas-fisicos-depressao',
      'teste-depressao-gratuito',
    ]
    for (const slug of slugs) {
      try {
        const record = app.findFirstRecordByData('posts', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    }
  },
)
