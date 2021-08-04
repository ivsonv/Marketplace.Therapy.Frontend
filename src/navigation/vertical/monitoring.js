export default [{
  title: 'Monitoramento',
  icon: 'MonitorIcon',
  tagVariant: 'light-warning',
  child: [
    {
      title: 'Filas',
      route: 'monitoring-queues',
      icon: "MonitorIcon",
      roles: ['permission.monitoring.queue.view']
    },
  ]
}]