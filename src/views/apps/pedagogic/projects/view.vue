<template>
  <b-card>
    <b-tabs pills>
      <!-- Tab: Account -->
      <b-tab
        :active="selected_tab_name === 'project_tab'"
        @click="activeTab('project_tab')"
      >
        <template #title>
          <feather-icon icon="UserIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Projeto</span>
        </template>
        <project-view
          class="mt-2 pt-75"
          v-if="selected_tab_name === 'project_tab'"
        />
      </b-tab>

      <!-- Tab: Information -->
      <b-tab
        :active="selected_tab_name === 'events_tab'"
        @click="activeTab('events_tab')"
      >
        <template #title>
          <feather-icon icon="GiftIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Eventos</span>
        </template>
        <project-events
          class="mt-2 pt-75"
          v-if="selected_tab_name === 'events_tab'"
        />
      </b-tab>

      <!-- Tab: Social -->
      <b-tab
        :active="selected_tab_name === 'course_tab'"
        @click="activeTab('course_tab')"
      >
        <template #title>
          <feather-icon icon="ArchiveIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Cursos</span>
        </template>
        <project-courses
          class="mt-2 pt-75"
          v-if="selected_tab_name === 'course_tab'"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import ProjectView from "./project-view.vue";
import ProjectEvents from "./events/project-events";
import ProjectCourses from "./courses/project-courses";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    ProjectView,
    ProjectEvents,
    ProjectCourses,
  },
  data() {
    return {
      selected_tab_name: "project_tab",
    };
  },
  created() {
    this.tabs();
  },
  methods: {
    activeTab(tab) {
      this.selected_tab_name = tab;
    },
    tabs() {
      if (this.$route.params.tab) {
        this.selected_tab_name = this.$route.params.tab;
      } else this.selected_tab_name = "project_tab";
    },
  },
};
</script>
