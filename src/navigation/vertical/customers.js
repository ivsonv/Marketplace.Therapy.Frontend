export default [
  {
    header: 'Acesso Paciente',
  },
  {
    title: 'Minhas Sessões',
    route: 'account-customer-reports',
    icon: 'DatabaseIcon',
    active: true,
    roles: ['account.customer']
  },
  {
    title: 'Minha Conta',
    route: 'account-customer-details',
    icon: 'UserIcon',
    active: true,
    roles: ['account.customer']
  }]