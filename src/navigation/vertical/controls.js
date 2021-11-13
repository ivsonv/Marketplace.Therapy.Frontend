export default [{
  title: 'Gestão',
  icon: 'CommandIcon',
  children: [
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
      title: 'Clientes',
      route: 'constrols-customers-list',
      icon: 'UserCheckIcon',
      roles: ['customer.view']
    },
  ]
}]