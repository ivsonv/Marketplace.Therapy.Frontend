export default [{
  title: 'Cadastros',
  icon: 'ClipboardIcon',
  children: [
    {
      title: 'Grupo de acessos',
      route: 'registrations-group-list',
      icon: 'ShieldIcon',
      roles: ['permission.permissiongroup.view']
    },
    {
      title: 'Usuários',
      route: 'registrations-users-list',
      icon: 'UsersIcon',
      roles: ['permission.user.view']
    },
    {
      title: 'Empresas',
      route: 'registrations-companies-list',
      icon: 'HomeIcon',
      roles: ['permission.company.view']
    },
    {
      title: 'Notificações',
      route: 'registrations-notifications-list',
      icon: 'MailIcon',
      roles: ['permission.notification.view']
    }
  ]
}]