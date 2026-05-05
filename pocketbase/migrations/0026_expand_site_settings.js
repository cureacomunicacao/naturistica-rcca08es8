migrate((app) => {
  const settings = [
    { key: 'contact_label_name', value: 'Nome Completo *' },
    { key: 'contact_label_phone', value: 'WhatsApp *' },
    { key: 'contact_label_email', value: 'Email' },
    { key: 'contact_label_treatment', value: 'Qual tratamento você procura?' },
    { key: 'contact_placeholder_treatment', value: 'Selecione um tratamento...' },
    { key: 'contact_label_message', value: 'Mensagem (Opcional)' },
    { key: 'contact_btn_submit', value: 'Enviar e Continuar no WhatsApp' },
    { key: 'contact_btn_submitting', value: 'Enviando...' },
    { key: 'nav_home', value: 'Início' },
    { key: 'nav_about', value: 'Sobre' },
    { key: 'nav_treatments', value: 'Tratamentos' },
    { key: 'nav_contact', value: 'Contato' },
    { key: 'nav_blog', value: 'Blog' },
  ]

  const collection = app.findCollectionByNameOrId('site_settings')

  for (const s of settings) {
    try {
      app.findFirstRecordByData('site_settings', 'key', s.key)
    } catch (_) {
      const record = new Record(collection)
      record.set('key', s.key)
      record.set('value', s.value)
      app.save(record)
    }
  }
})
