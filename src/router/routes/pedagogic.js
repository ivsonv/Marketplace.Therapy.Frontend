export default [{
  path: '/pedagogic/teachers',
  name: 'pedagogic-teachers',
  component: () => import('@/views/apps/pedagogic/teachers/index.vue'),
},
{
  path: '/pedagogic/teacher/:id',
  name: 'pedagogic-teacher-save',
  component: () => import('@/views/apps/pedagogic/teachers/teacher.vue'),
},
{
  path: '/pedagogic/calendar',
  name: 'pedagogic-calendar',
  component: () => import('@/views/apps/pedagogic/calendar-imp/index.vue'),
},
{
  path: '/pedagogic/projects',
  name: 'pedagogic-projects',
  component: () => import('@/views/apps/pedagogic/projects/index.vue')
},
{
  path: '/pedagogic/project/:id',
  name: 'pedagogic-project-save',
  component: () => import('@/views/apps/pedagogic/projects/project.vue')
},
{
  path: '/pedagogic/project-view/:id',
  name: 'pedagogic-project-view',
  component: () => import('@/views/apps/pedagogic/projects/view.vue')
},
{
  path: '/pedagogic/project-view/:id/tab/:tab',
  name: 'pedagogic-project-view-tab',
  component: () => import('@/views/apps/pedagogic/projects/view.vue')
},
{
  path: '/pedagogic/project-view/:projectId/event/:id',
  name: 'pedagogic-events-view',
  component: () => import('@/views/apps/pedagogic/projects/subevents/project-subevents.vue'),
  meta: {
    breadcrumb: [
      {
        text: 'Projetos',
        back: true,
        backto: -2,
        tab: {
          name: "project_tab",
          origin_name: "pedagogic-project-view",
          replace_params: [
            {
              in: ":projectId",
              for: ":id"
            }
          ]
        }
      },
      {
        text: 'Eventos',
        back: true,
        backto: -1,
        tab: {
          name: "events_tab",
          origin_name: "pedagogic-project-view",
          replace_params: [
            {
              in: ":projectId",
              for: ":id"
            }
          ]
        }
      },
      {
        text: 'Sub Eventos',
        active: true
      },
    ],
  }
},
{
  path: '/pedagogic/project-view/:projectId/course/:id',
  name: 'pedagogic-courses-view',
  component: () => import('@/views/apps/pedagogic/projects/lessons/project-lessons.vue'),
  meta: {
    breadcrumb: [
      {
        text: 'Projetos',
        back: true,
        backto: -2,
        tab: {
          name: "project_tab",
          origin_name: "pedagogic-project-view",
          replace_params: [
            {
              in: ":projectId",
              for: ":id"
            }
          ]
        }
      },
      {
        text: 'Cursos',
        back: true,
        backto: -1,
        tab: {
          name: "course_tab",
          origin_name: "pedagogic-project-view",
          replace_params: [
            {
              in: ":projectId",
              for: ":id"
            }
          ]
        }
      },
      {
        text: 'Aulas',
        active: true
      },
    ],
  }
},
{
  path: '/pedagogic/appointment/:id',
  name: 'pedagogic-appointment-save',
  component: () => import('@/views/apps/pedagogic/appointment/appointment.vue'),
}]