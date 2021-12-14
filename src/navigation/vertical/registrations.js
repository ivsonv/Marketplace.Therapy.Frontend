export default [{
  title: 'Cadastros',
  icon: 'ClipboardIcon',
  children: [
    {
      title: 'FAQ',
      route: 'registrations-faq-list',
      icon: 'HelpCircleIcon',
      roles: ['faq.permission.view']
    },
    {
      title: 'Grupo de acessos',
      route: 'registrations-group-list',
      icon: 'ShieldIcon',
      roles: ['group.permission.view']
    },
    {
      title: 'Bancos',
      route: 'registrations-banks-list',
      icon: 'BoxIcon',
      roles: ['bank.view']
    },
    {
      title: 'Espec. / Exper.',
      route: 'registrations-topics-list',
      icon: 'GitBranchIcon',
      roles: ['topic.view']
    }
  ]
}]