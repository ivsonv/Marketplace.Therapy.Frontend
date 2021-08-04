export default [{
  title: 'Relatórios',
  icon: 'DatabaseIcon',
  tagVariant: 'light-warning',
  children: [
    {
      title: 'Projetos - Agenda',
      route: 'projects-calendar',
      icon: "CalendarIcon",
      roles: ['permission.reports.view']
    }
  ]
}]