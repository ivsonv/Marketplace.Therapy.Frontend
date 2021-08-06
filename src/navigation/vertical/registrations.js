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
      title: 'Temas',
      route: 'registrations-topics-list',
      icon: 'GitBranchIcon',
      roles: ['topic.view']
    }
  ]
}]