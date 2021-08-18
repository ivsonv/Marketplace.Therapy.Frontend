export default [{
  title: 'Cadastros',
  icon: 'ClipboardIcon',
  children: [
    {
      title: 'Grupo de acessos',
      route: 'registrations-group-list',
      icon: 'ShieldIcon',
      roles: ['group.permission.view']
    },
    {
      title: 'Usuários',
      route: 'registrations-users-list',
      icon: 'UsersIcon',
      roles: ['user.view']
    },
    {
      title: 'Psicólogos',
      route: 'registrations-providers-list',
      icon: 'UserCheckIcon',
      roles: ['provider.view']
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