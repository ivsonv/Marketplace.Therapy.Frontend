export default [{
  title: 'Audio Visual',
  icon: 'ActivityIcon',
  tagVariant: 'light-warning',
  children: [
    {
      title: 'Operadores',
      route: 'audiovisual-operators',
      icon: "UsersIcon",
      roles: ['permission.operators.view']
    },
    {
      title: 'Estúdios',
      route: 'audiovisual-studiosgroup',
      icon: "HeadphonesIcon",
      roles: ['permission.studiogroup.view']
    },
    {
      title: 'Escala de Operadores',
      route: 'audiovisual-operators-scale',
      icon: "ClockIcon",
      roles: ['permission.appointment.studio.operator.view']
    }
  ]
}]
