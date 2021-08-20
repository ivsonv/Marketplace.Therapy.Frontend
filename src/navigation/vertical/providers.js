export default [
  {
    header: 'Acesso Restrito',
  },
  {
    title: 'Agenda',
    route: 'account-appointments',
    icon: 'CalendarIcon',
    active: true,
    roles: ['account.provider']
  },
  {
    title: 'Minha Conta',
    route: 'account-details',
    icon: 'UserIcon',
    active: true,
    roles: ['account.provider']
  },
  {
    title: 'Meus Horários',
    route: 'account-schedules',
    icon: 'ClockIcon',
    active: true,
    roles: ['account.provider']
  },
  {
    title: 'Relatório Financeiro',
    route: 'account-reports',
    icon: 'DatabaseIcon',
    active: true,
    roles: ['account.provider.view']
  }]