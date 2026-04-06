migrate(
  (app) => {
    const postsCollection = app.findCollectionByNameOrId('posts')

    const seedPosts = [
      {
        title: 'Quais os Sintomas de Ansiedade? Guia Completo com Sinais no Corpo e Mente',
        slug: 'sintomas-de-ansiedade',
        category: 'ANSIEDADE',
        status: 'published',
        seo_title: 'Sintomas de Ansiedade: Guia Completo | Naturistica',
        seo_description:
          'Descubra os principais sinais físicos e mentais da ansiedade e aprenda quando procurar ajuda especializada.',
        content: `
        <h2>Entendendo a Ansiedade: Muito Além do Nervosismo</h2>
        <p>A ansiedade é uma resposta natural do nosso corpo a situações de estresse ou perigo, preparando-nos para lutar ou fugir. No entanto, quando essa resposta se torna constante, desproporcional ou surge sem um motivo aparente, ela pode se transformar em um transtorno de ansiedade, afetando profundamente a qualidade de vida, os relacionamentos e a capacidade de realizar tarefas do dia a dia.</p>
        <p>Muitas vezes, os sinais da ansiedade são ignorados ou confundidos com cansaço do dia a dia. É fundamental reconhecê-los precocemente para buscar o equilíbrio e o tratamento adequado, unindo a sabedoria ancestral da medicina natural com abordagens científicas contemporâneas. Na Naturística, entendemos que o corpo e a mente estão intrinsecamente conectados, e tratar os sintomas isoladamente muitas vezes não resolve a raiz do problema.</p>
        
        <h3>Os Principais Sinais no Corpo e na Mente</h3>
        <p>A ansiedade não se manifesta apenas em pensamentos acelerados; ela ecoa por todo o corpo. Muitas vezes, os pacientes buscam especialistas como cardiologistas e neurologistas devido aos sintomas físicos, apenas para descobrir que a causa raiz é emocional. Abaixo, listamos mais de 20 sintomas comuns, divididos entre manifestações físicas e psicológicas:</p>
        
        <h4>Sintomas Físicos</h4>
        <ol>
          <li><strong>Taquicardia ou palpitações:</strong> O coração bate de forma acelerada, irregular ou forte demais, mesmo em momentos de repouso.</li>
          <li><strong>Falta de ar ou respiração ofegante:</strong> Sensação de aperto no peito, dificuldade para respirar profundamente, ou hiperventilação.</li>
          <li><strong>Tensão muscular constante:</strong> Dores crônicas nos ombros, pescoço, costas e mandíbula (frequentemente resultando em bruxismo durante a noite).</li>
          <li><strong>Tremores:</strong> Mãos, pernas ou o corpo inteiro tremendo de forma involuntária e perceptível.</li>
          <li><strong>Sudorese excessiva:</strong> Suor frio, especialmente nas mãos, axilas e pés, mesmo em ambientes com temperatura amena.</li>
          <li><strong>Problemas gastrointestinais:</strong> Náuseas, diarreia, constipação, dor de estômago, síndrome do intestino irritável ou a clássica sensação de "frio na barriga".</li>
          <li><strong>Tontura ou vertigem:</strong> Sensação de desequilíbrio, cabeça leve ou de que vai desmaiar a qualquer momento.</li>
          <li><strong>Fadiga e exaustão extremas:</strong> Cansaço persistente e falta de energia, mesmo após uma noite que deveria ser de descanso reparador.</li>
          <li><strong>Alterações no padrão de sono:</strong> Insônia severa, dificuldade crônica para adormecer, ou acordar várias vezes durante a madrugada com o coração acelerado.</li>
          <li><strong>Alterações no apetite:</strong> Comer de forma compulsiva para aliviar o estresse, ou perder completamente a vontade de comer, levando a flutuações de peso.</li>
          <li><strong>Dores de cabeça tensionais:</strong> Dores frequentes e latejantes, especialmente ao redor da testa, têmporas e nuca.</li>
          <li><strong>Boca seca:</strong> Sensação constante de sede ou secura extrema na boca e garganta.</li>
          <li><strong>Zumbido no ouvido (Tinnitus):</strong> Percepção de sons agudos ou zumbidos constantes sem uma fonte externa.</li>
          <li><strong>Calafrios ou ondas de calor:</strong> Mudanças bruscas na percepção da temperatura corporal, muitas vezes acompanhadas de rubor facial.</li>
          <li><strong>Sensação de nó na garganta:</strong> Dificuldade para engolir ou a sensação física de que há algo preso na garganta (globus faríngeo).</li>
        </ol>

        <h4>Sintomas Psicológicos e Emocionais</h4>
        <ol start="16">
          <li><strong>Preocupação excessiva e crônica:</strong> Pensamentos sempre focados no futuro, no que pode dar errado, e a tendência constante de catastrofizar situações cotidianas.</li>
          <li><strong>Sensação de perigo iminente:</strong> Um medo irracional e avassalador de que algo terrível vai acontecer a qualquer momento, sem nenhuma justificativa lógica.</li>
          <li><strong>Dificuldade severa de concentração:</strong> Mente dispersa, esquecimentos frequentes (brancos de memória) e dificuldade extrema de manter o foco no presente ou em tarefas simples.</li>
          <li><strong>Irritabilidade e impaciência:</strong> Pavio curto, intolerância com pequenas frustrações diárias e oscilações bruscas de humor.</li>
          <li><strong>Inquietação mental e motora:</strong> Incapacidade absoluta de relaxar, sentindo-se sempre "no limite", "com os nervos à flor da pele" ou prestes a explodir.</li>
          <li><strong>Medo de perder o controle:</strong> Pavor de enlouquecer, de não conseguir lidar com as próprias emoções ou de ter um colapso em público.</li>
          <li><strong>Despersonalização ou desrealização:</strong> Sensação assustadora de estar desconectado do próprio corpo (como observar a si mesmo de fora) ou de que o mundo ao redor não é real ou familiar.</li>
          <li><strong>Evitação social e agorafobia:</strong> Vontade crescente de se isolar do convívio e evitar proativamente situações, lugares ou pessoas que possam desencadear uma crise de ansiedade.</li>
        </ol>

        <h3>Quando Procurar Ajuda Profissional?</h3>
        <p>É perfeitamente normal e saudável sentir ansiedade antes de uma entrevista de emprego, de um exame importante ou de falar em público. Mas, se você se identificou com vários dos sintomas listados acima e eles têm ocorrido na maior parte dos dias, durando por semanas ou até meses, é um sinal claro de alerta de que seu corpo e sua mente estão sobrecarregados e precisam de cuidado especializado.</p>
        <p>Procure ajuda profissional imediatamente se a ansiedade estiver:</p>
        <ul>
          <li>Prejudicando significativamente seu desempenho no trabalho, na faculdade ou na escola.</li>
          <li>Afetando negativamente seus relacionamentos familiares, amorosos ou de amizade.</li>
          <li>Impedindo-o de sair de casa ou de realizar atividades que antes lhe davam prazer e satisfação.</li>
          <li>Causando sofrimento intenso diário, crises de pânico, ou sendo acompanhada de pensamentos de desesperança ou falta de sentido na vida.</li>
        </ul>
        <p>Na Naturística, acreditamos que a verdadeira cura vem de um olhar profundo para o ser humano como um todo. Através da união responsável de terapias naturais (como fitoterapia e Ayurveda), psicoterapia humanizada, e práticas contemplativas (mindfulness), podemos ajudar você a reencontrar o seu centro, restaurar o equilíbrio do seu sistema nervoso e voltar a viver com mais leveza, resiliência e presença.</p>
      `,
      },
      {
        title: 'Teste de Ansiedade Grátis: Faça Agora e Descubra Seu Nível em 5 Minutos',
        slug: 'teste-de-ansiedade',
        category: 'ANSIEDADE',
        status: 'published',
        seo_title: 'Teste de Ansiedade Online e Grátis | Naturistica',
        seo_description:
          'Faça nosso quiz de 5 minutos e descubra seu nível de ansiedade com resultados imediatos.',
        content: `
        <p class="lead text-xl text-gray-700 font-medium mb-6">A ansiedade é uma experiência comum na vida moderna, mas quando ocorre em excesso, pode se tornar um obstáculo considerável para uma vida plena, saudável e feliz.</p>
        <p>Este teste interativo foi cuidadosamente desenvolvido para ajudar você a refletir sobre os sintomas que tem sentido nas últimas semanas e oferecer uma percepção inicial sobre o seu nível de ansiedade atual, baseado em protocolos validados internacionalmente para rastreio de sintomas ansiosos.</p>
        <p><strong>Lembre-se:</strong> este teste é apenas uma ferramenta de autoconhecimento e triagem inicial; ele não substitui, de forma alguma, um diagnóstico clínico profissional realizado por um psicólogo ou médico. O objetivo é fornecer clareza e guiar seus próximos passos em direção ao autocuidado e bem-estar.</p>
        <p class="mb-8">Responda às perguntas abaixo com a maior sinceridade possível, escolhendo a opção que melhor descreve como você tem se sentido recentemente em seu dia a dia.</p>
      `,
      },
      {
        title: 'Ansiedade: Como Tratar de Forma Natural e Eficaz em Casa',
        slug: 'ansiedade-como-tratar',
        category: 'ANSIEDADE',
        status: 'published',
        seo_title: 'Como Tratar Ansiedade Naturalmente | Naturistica',
        seo_description:
          'Guia prático de técnicas naturais, respiração e terapias ancestrais para controle da ansiedade.',
        content: `
        <h2>Caminhos Naturais para Acalmar a Mente e o Corpo</h2>
        <p>Vivemos em um mundo hiperconectado e acelerado, onde a ansiedade muitas vezes parece inevitável. Somos bombardeados por informações e exigências constantes. No entanto, a natureza e as práticas ancestrais nos oferecem um vasto arsenal de ferramentas para restaurar o equilíbrio do sistema nervoso, reduzir o estresse crônico e promover uma paz interior duradoura e resiliente.</p>
        <p>Neste guia abrangente, exploraremos abordagens holísticas, mudanças de estilo de vida e práticas comprovadas que você pode incorporar de forma simples na sua rotina diária para tratar a ansiedade de forma natural e eficaz, sempre sob a ótica da saúde integrativa que valorizamos na Naturística.</p>

        <h3>1. O Poder Transformador da Respiração (Pranayama)</h3>
        <p>A respiração é a ponte direta entre a mente e o corpo autônomo. Quando estamos ansiosos, nossa respiração torna-se curta, torácica e superficial, enviando sinais de perigo e alerta contínuo ao cérebro. Ao alterar conscientemente o padrão respiratório, podemos ativar rapidamente o sistema nervoso parassimpático, o responsável pela resposta de relaxamento profundo, descanso e digestão.</p>
        <ul>
          <li><strong>Respiração Diafragmática (Respiração Abdominal):</strong> Deite-se confortavelmente ou sente-se com a coluna ereta. Coloque uma mão no centro do peito e outra no abdômen. Inspire profundamente pelo nariz, sentindo o abdômen se expandir como um balão (a mão no peito deve mover-se o mínimo possível). Expire lenta e longamente pela boca. Pratique consistentemente por 5 a 10 minutos diários.</li>
          <li><strong>Técnica de Respiração 4-7-8 (Técnica do Dr. Andrew Weil):</strong> Inspire suavemente pelo nariz contando mentalmente até 4. Prenda a respiração confortavelmente contando até 7. Expire totalmente pela boca fazendo um som de sopro, contando até 8. Esta técnica é excelente para induzir o sono à noite e para cortar crises de ansiedade aguda pela raiz.</li>
          <li><strong>Nadi Shodhana (Respiração das Narinas Alternadas):</strong> Uma prática da milenar tradição yogue que equilibra os hemisférios cerebrais esquerdo e direito. Inspire pela narina esquerda (bloqueando a direita suavemente com o polegar), feche a esquerda com o dedo anelar e expire pela direita. Inspire pela direita, feche-a e expire pela esquerda. Repita esse ciclo de forma fluida por alguns minutos.</li>
        </ul>

        <h3>2. O Movimento que Cura e Liberta</h3>
        <p>O exercício físico regular é um dos ansiolíticos naturais mais potentes e acessíveis conhecidos pela ciência. Ele ajuda a "queimar" a energia sobressalente do estresse, libera endorfinas (hormônios do bem-estar), reduz significativamente os níveis de cortisol sistêmico e ajuda a descarregar a tensão muscular acumulada no corpo.</p>
        <ul>
          <li><strong>Yoga e Alongamento Consciente:</strong> Une movimento fluido, respiração coordenada e atenção plena. Posturas restaurativas como a Postura da Criança (Balasana), Flexão à Frente (Uttanasana) e a Postura do Cadáver (Savasana) são particularmente calmantes e aterradoras.</li>
          <li><strong>Caminhadas na Natureza (Banho de Floresta / Shinrin-yoku):</strong> O contato imersivo com ambientes naturais (parques, trilhas, praia) reduz a atividade do córtex pré-frontal (área associada à ruminação mental) e diminui comprovadamente a pressão arterial e a frequência cardíaca.</li>
          <li><strong>Exercícios Aeróbicos Suaves e Moderados:</strong> Natação, ciclismo ao ar livre ou dança em ritmo confortável ajudam a regular o ritmo circadiano e o sistema nervoso sem causar sobrecarga ou esgotamento.</li>
        </ul>

        <h3>3. Fitoterapia e Ayurveda: A Farmácia Viva da Natureza</h3>
        <p>As plantas e ervas medicinais têm sido usadas com sabedoria há milênios para modular o humor, tonificar o sistema nervoso e acalmar a mente. Na medicina Ayurveda, a ansiedade é frequentemente vista como um agravamento e desequilíbrio do dosha Vata (caracterizado pelos elementos ar e éter), e o tratamento natural visa primariamente ancorar, aquecer e nutrir o corpo seco e agitado.</p>
        <ul>
          <li><strong>Ashwagandha (Withania somnifera):</strong> Um adaptógeno ayurvédico incrivelmente poderoso que ajuda o corpo a resistir e se adaptar a diferentes tipos de estresse, reduzindo os níveis de cortisol matinal e promovendo uma profunda estabilidade emocional sem causar sonolência excessiva.</li>
          <li><strong>Infusões Calmantes (Camomila, Melissa e Passiflora):</strong> Chás feitos com essas ervas contêm fitoquímicos ativos que interagem sinergicamente com os receptores GABA no cérebro (o principal neurotransmissor inibitório), induzindo relaxamento, reduzindo palpitações e melhorando imensamente a arquitetura do sono.</li>
          <li><strong>Aromaterapia com Óleo Essencial de Lavanda:</strong> A inalação de compostos da lavanda tem eficácia clínica comprovada na redução rápida da ansiedade e agitação, seja inalado diretamente, usado em difusores de ambiente ou aplicado no peito e pulsos (sempre diluído em um óleo carreador como óleo de amêndoas ou coco).</li>
          <li><strong>Alimentação Aterradora e Nutritiva:</strong> Para pacificar o excesso de Vata, priorize refeições quentes, cozidas, levemente oleosas (usando Ghee ou azeite de oliva) e profundamente nutritivas (como raízes, tubérculos, sopas encorpadas, mingaus de aveia) e utilize especiarias digestivas e aquecedoras como gengibre fresco, canela, cardamomo e noz-moscada. Evite cafeína, estimulantes, açúcar refinado e alimentos frios ou secos.</li>
        </ul>

        <h3>4. Práticas Contemplativas, Atenção Plena e Autocuidado</h3>
        <p>O foco principal da ansiedade é viver temendo um futuro que ainda não chegou ou lamentando um passado que já se foi. O antídoto mais eficaz é treinar a mente para habitar e ancorar-se no momento presente.</p>
        <ul>
          <li><strong>Meditação Mindfulness (Atenção Plena):</strong> Dedique de 10 a 20 minutos por dia logo pela manhã ou antes de dormir para simplesmente sentar em silêncio e observar a sua respiração ou as sensações táteis do corpo (body scan), sem qualquer julgamento. Quando os pensamentos surgirem, observe-os passar como nuvens no céu ou folhas num rio, sem se apegar a eles.</li>
          <li><strong>Escrita Terapêutica (Journaling Expressivo):</strong> O hábito de despejar preocupações diárias no papel ajuda a "esvaziar o HD mental", organizar a mente, processar emoções complexas e reduzir o peso emocional dos pensamentos ruminantes que nos mantêm acordados de madrugada.</li>
          <li><strong>Higiene do Sono e Desconexão Digital:</strong> Estabeleça horários rígidos para se desconectar de telas azuis (celular, TV, computador) e do consumo de notícias (especialmente as negativas) pelo menos uma a duas horas antes de dormir, permitindo que a produção natural de melatonina ocorra e seu sistema nervoso desacelere gradativamente.</li>
        </ul>

        <h3>Integrando os Saberes Naturais na Sua Vida</h3>
        <p>Embora as práticas apresentadas acima sejam altamente eficazes e validadas, elas não são um passe de mágica de efeito instantâneo. A constância e a disciplina amorosa são as verdadeiras chaves do sucesso terapêutico. Além disso, a auto-observação é fundamental e inegociável: o que funciona maravilhosamente bem para uma pessoa pode não ser o ideal ou ter o mesmo efeito para outra.</p>
        <p>Se a ansiedade persistir, se tornar paralisante ou interferir demasiadamente na sua qualidade de vida, não hesite em procurar orientação profissional qualificada. Na Naturística, oferecemos um acompanhamento verdadeiramente integrativo, multidisciplinar e acolhedor, unindo a ciência moderna e a sabedoria da ancestralidade para criar um plano de tratamento único e totalmente personalizado que atenda às suas mais profundas necessidades físicas, mentais, emocionais e espirituais.</p>
      `,
      },
    ]

    for (const post of seedPosts) {
      try {
        app.findFirstRecordByData('posts', 'slug', post.slug)
      } catch (_) {
        const record = new Record(postsCollection)
        record.set('title', post.title)
        record.set('slug', post.slug)
        record.set('category', post.category)
        record.set('status', post.status)
        record.set('seo_title', post.seo_title)
        record.set('seo_description', post.seo_description)
        record.set('content', post.content)
        app.save(record)
      }
    }
  },
  (app) => {
    const slugs = ['sintomas-de-ansiedade', 'teste-de-ansiedade', 'ansiedade-como-tratar']
    for (const slug of slugs) {
      try {
        const record = app.findFirstRecordByData('posts', 'slug', slug)
        app.delete(record)
      } catch (_) {}
    }
  },
)
