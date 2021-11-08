export default [{
  title: 'Dashboard',
  icon: 'PieChartIcon',
  children: [
    {
      title: 'Visão Geral',
      route: 'dashboard-overview-list',
      icon: 'TargetIcon',
      roles: ['dashboard.view']
    },
    {
      title: 'Pedidos',
      route: 'dashboard-sales-list',
      icon: 'ShoppingBagIcon',
      roles: ['dashboard.view']
    }
  ]
}]