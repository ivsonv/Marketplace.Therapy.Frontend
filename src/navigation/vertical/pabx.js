export default [
  {
    title: 'PABX',
    icon: "SettingsIcon",
    child: [
      {
        title: 'Agentes',
        route: 'pabx-agents',
        icon: "UserIcon",
        roles: ['permission.pabx.agents.view']
      },
      {
        title: 'Filas',
        route: 'pabx-queues',
        icon: "GitPullRequestIcon",
        roles: ['permission.pabx.queue.view']
      },
    ],
  }]