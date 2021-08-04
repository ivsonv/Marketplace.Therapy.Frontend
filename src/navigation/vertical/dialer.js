export default [{
  title: 'Discador',
  icon: 'CpuIcon',
  tagVariant: 'light-warning',
  child: [
    {
      title: 'Contatos',
      route: 'dialer-contacts',
      icon: "SettingsIcon",
      roles: ['permission.dialer.contact.view']
    },
    {
      title: 'Destino',
      route: 'dialer-destinations',
      icon: "MapIcon",
      roles: ['permission.dialer.destiny.view']
    },
    {
      title: 'BlackList',
      route: 'dialer-blacklist',
      icon: "PhoneOffIcon",
      roles: ['permission.dialer.blacklist.view']
    },
    {
      title: 'Horário de Funcio.',
      route: 'dialer-opening-hours',
      icon: "CoffeeIcon",
      roles: ['permission.dialer.hour.fun.view']
    },
    {
      title: 'Parâm. Campanha',
      route: 'dialer-campaign-parameters',
      icon: "PlusSquareIcon",
      roles: ['permission.dialer.param.campaign.view']
    },
    {
      title: 'Campanha',
      route: 'dialer-campaign',
      icon: "PhoneOutgoingIcon",
      roles: ['permission.dialer.campaign.view']
    }
  ]
}]