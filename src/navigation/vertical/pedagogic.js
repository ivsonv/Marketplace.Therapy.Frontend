export default [{
  title: 'Pedagógico',
  icon: 'FolderIcon',
  tagVariant: 'light-warning',
  children: [
    {
      title: 'Professores',
      route: 'pedagogic-teachers',
      icon: "UsersIcon",
      roles: ['permission.teacher.view']
    },
    {
      title: 'Projetos',
      route: 'pedagogic-projects',
      icon: "ClipboardIcon",
      roles: ['permission.project.view']
    },
    {
      title: 'Agenda',
      route: 'pedagogic-calendar',
      icon: "CastIcon",
      roles: ['permission.appointment.view']
    }
  ]
}]