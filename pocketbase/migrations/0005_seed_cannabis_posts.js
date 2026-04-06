migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId('posts')

    const articles = [
      {
        title: 'Tratamento com Cannabis Medicinal para Depressão: Funciona Mesmo?',
        slug: 'tratamento-cannabis-medicinal-depressao',
        category: 'Cannabis Medicinal',
        status: 'published',
        content: `<p>A depressão é uma das condições de saúde mental mais prevalentes no mundo contemporâneo. Muitos pacientes relatam que os tratamentos farmacológicos tradicionais oferecem alívio parcial ou geram efeitos colaterais severos. Nesse contexto, a Cannabis Medicinal desponta como uma opção promissora, atuando diretamente no sistema endocanabinoide do corpo humano, que regula o humor, o sono e o apetite.</p>
<p>Estudos clínicos recentes indicam que compostos como o CBD (Canabidiol) possuem propriedades ansiolíticas e antidepressivas. Ao contrário do THC, o CBD não produz efeitos psicoativos significativos, tornando-se uma opção segura para o uso contínuo sob prescrição e acompanhamento médico adequado. O tratamento é individualizado, e a dosagem varia de acordo com as necessidades e respostas de cada paciente, visando restaurar o equilíbrio e a qualidade de vida.</p>
<p>Se você ou um ente querido enfrenta desafios com a depressão e busca alternativas baseadas em evidências científicas e abordagens integrativas, nossa equipe especializada está pronta para ajudar. Nossa clínica oferece um ambiente acolhedor e focado na sua saúde integral. <strong>Agende via WhatsApp</strong> uma consulta de avaliação e descubra como a Cannabis Medicinal pode fazer parte do seu processo de cura.</p>`,
      },
      {
        title: 'Cannabis Medicinal: Benefícios para Dor Crônica e Evidências Científicas',
        slug: 'cannabis-medicinal-beneficios-dor-cronica',
        category: 'Cannabis Medicinal',
        status: 'published',
        content: `<p>A dor crônica afeta milhões de pessoas, limitando a mobilidade, prejudicando o sono e reduzindo drasticamente a qualidade de vida. Analgésicos convencionais muitas vezes perdem a eficácia com o tempo ou trazem riscos de dependência. A Cannabis Medicinal tem se mostrado uma alternativa altamente eficaz no manejo da dor, com sólida base de evidências científicas atestando seus benefícios anti-inflamatórios e neuromoduladores.</p>
<p>O sistema endocanabinoide possui receptores espalhados por todo o sistema nervoso central e periférico. Quando os fitocanabinoides (como CBD e THC em proporções controladas) interagem com esses receptores, eles alteram a percepção da dor e reduzem a inflamação local. Essa abordagem tem sido particularmente útil em casos de fibromialgia, artrite, dor neuropática e dores oncológicas, oferecendo alívio contínuo e melhoria funcional.</p>
<p>Não deixe que a dor crônica controle a sua vida. O acompanhamento médico integrativo é fundamental para determinar a dosagem correta e o melhor extrato de Cannabis para o seu caso específico. Dê o primeiro passo em direção a uma vida com mais conforto e bem-estar. <strong>Agende via WhatsApp</strong> uma avaliação com nossos especialistas.</p>`,
      },
      {
        title: 'Cannabis Medicinal no Brasil: Como Conseguir Receita e Legalidade 2026',
        slug: 'cannabis-medicinal-brasil-receita-legalidade-2026',
        category: 'Cannabis Medicinal',
        status: 'published',
        content: `<p>O acesso à Cannabis Medicinal no Brasil tem evoluído significativamente, trazendo esperança para milhares de pacientes. Em 2026, o marco regulatório estabelecido pela Anvisa torna o processo de importação e aquisição de produtos à base de Cannabis mais claro e seguro, desde que haja a prescrição médica correta. Muitas pessoas ainda têm dúvidas sobre como iniciar esse tratamento de forma legal e segura.</p>
<p>O primeiro passo é sempre a consulta médica. Apenas profissionais habilitados podem avaliar a indicação clínica, determinar o tipo de canabinoide necessário (CBD, THC, CBG, entre outros) e emitir a receita médica especial. Com a prescrição em mãos, o paciente ou seu representante legal pode solicitar a autorização de importação pelo portal do governo ou adquirir produtos já liberados nas farmácias brasileiras. O processo foi desburocratizado para garantir que o tratamento não sofra interrupções.</p>
<p>Se você tem interesse em iniciar o tratamento com Cannabis Medicinal de forma 100% legalizada e com suporte médico de excelência, nós podemos orientá-lo em todas as etapas, desde a avaliação clínica até as orientações documentais. <strong>Agende via WhatsApp</strong> a sua consulta e esclareça todas as suas dúvidas com nossa equipe.</p>`,
      },
      {
        title: 'Cannabis Medicinal para Epilepsia Infantil',
        slug: 'cannabis-medicinal-epilepsia-infantil',
        category: 'Cannabis Medicinal',
        status: 'published',
        content: `<p>A epilepsia refratária na infância é uma das condições mais desafiadoras para neuropediatras e, principalmente, para as famílias. Crises convulsivas frequentes comprometem o desenvolvimento cognitivo e motor das crianças. A Cannabis Medicinal, com foco em extratos ricos em CBD, revolucionou o tratamento dessas síndromes (como Dravet e Lennox-Gastaut), apresentando resultados que nenhum outro medicamento conseguiu alcançar isoladamente.</p>
<p>Os estudos científicos demonstram que o uso rigorosamente controlado do Canabidiol pode reduzir a frequência e a intensidade das crises em mais de 50% na maioria dos pacientes pediátricos, e em alguns casos, zerar as convulsões. Além do controle das crises, relata-se melhora na interação social, no alerta e na qualidade do sono das crianças. É um tratamento transformador que exige acompanhamento médico próximo para ajuste fino de dosagens e monitoramento de interações com outros anticonvulsivantes.</p>
<p>Entendemos a urgência e a delicadeza de tratar crianças com epilepsia severa. Nossa equipe possui a experiência necessária para conduzir esse tratamento com segurança, empatia e base científica. Para saber mais sobre como podemos ajudar o seu filho a ter uma vida melhor, <strong>Agende via WhatsApp</strong> uma consulta especializada.</p>`,
      },
      {
        title: 'Cannabis Medicinal vs. Opioides: Qual a Melhor Opção para Dor?',
        slug: 'cannabis-medicinal-vs-opioides-dor',
        category: 'Cannabis Medicinal',
        status: 'published',
        content: `<p>O manejo da dor severa frequentemente envolve o uso de opioides, medicamentos potentes, mas que carregam riscos altíssimos de tolerância, dependência e efeitos adversos graves, incluindo a depressão respiratória. A crise dos opioides em vários países acendeu um alerta global para a necessidade de alternativas mais seguras. A Cannabis Medicinal surge como a principal candidata para substituir ou reduzir o uso de analgésicos narcóticos.</p>
<p>Pesquisas comparativas mostram que pacientes que iniciam a terapia com canabinoides conseguem diminuir significativamente a dosagem de opioides, minimizando os efeitos colaterais indesejados sem perder o controle álgico. A Cannabis age de forma sinérgica, atuando nos receptores de dor e nos processos inflamatórios, sem o risco de overdose letal associado aos opioides. Além disso, melhora o humor e a qualidade do sono, fatores vitais para quem convive com dores crônicas ou oncológicas.</p>
<p>A transição de opioides para a Cannabis Medicinal deve ser feita com planejamento e supervisão médica contínua para evitar síndromes de abstinência e garantir o alívio constante. Se você busca uma abordagem mais segura e natural para o controle da dor, fale conosco. <strong>Agende via WhatsApp</strong> uma consulta para elaborarmos um plano de tratamento integrativo e personalizado.</p>`,
      },
    ]

    articles.forEach((article) => {
      try {
        app.findFirstRecordByData('posts', 'slug', article.slug)
      } catch (_) {
        const record = new Record(posts)
        Object.entries(article).forEach(([k, v]) => record.set(k, v))
        app.save(record)
      }
    })
  },
  (app) => {
    const slugs = [
      'tratamento-cannabis-medicinal-depressao',
      'cannabis-medicinal-beneficios-dor-cronica',
      'cannabis-medicinal-brasil-receita-legalidade-2026',
      'cannabis-medicinal-epilepsia-infantil',
      'cannabis-medicinal-vs-opioides-dor',
    ]
    slugs.forEach((slug) => {
      try {
        const record = app.findFirstRecordByData('posts', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    })
  },
)
