export default [{
  path: '/registrations/companies',
  name: 'registrations-companies-list',
  component: () => import('@/views/apps/registrations/companies/index.vue'),
},
{
  path: '/registrations/company/:id',
  name: 'registrations-company-salvar',
  component: () => import('@/views/apps/registrations/companies/company.vue'),
},
{
  path: '/registrations/notifications',
  name: 'registrations-notifications-list',
  component: () => import('@/views/apps/registrations/notifications/index.vue'),
},
{
  path: '/registrations/notification/:id',
  name: 'registrations-notifications-save',
  component: () => import('@/views/apps/registrations/notifications/notification.vue'),
},
{
  path: '/registrations/users',
  name: 'registrations-users-list',
  component: () => import('@/views/apps/registrations/users/index.vue'),
},
{
  path: '/registrations/user/:id',
  name: 'registrations-users-save',
  component: () => import('@/views/apps/registrations/users/user.vue'),
},
{
  path: '/registrations/group-permissions',
  name: 'registrations-group-list',
  component: () => import('@/views/apps/registrations/group-permissions/index.vue'),
},
{
  path: '/registrations/group-permission/:id',
  name: 'registrations-group-save',
  component: () => import('@/views/apps/registrations/group-permissions/group-permissions.vue'),
},
{
  path: '/registrations/group-permission/:id/users',
  name: 'registrations-group-uses-save',
  component: () => import('@/views/apps/registrations/group-permissions/group-permissions-users.vue'),
}]