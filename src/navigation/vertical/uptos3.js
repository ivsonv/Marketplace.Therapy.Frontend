export default [{
  title: 'Questões',
  icon: 'TargetIcon',
  tagVariant: 'light-warning',
  children: [
    {
      title: 'Vínculos',
      route: 'uptos3-view',
      icon: "RepeatIcon",
      roles: ['permission.question.vinculos.view']
    },
    {
      title: 'Repetidas',
      route: 'uptos3-repeated-view',
      icon: "FastForwardIcon",
      roles: ['permission.question.repetidas.view']
    }
  ]
}]