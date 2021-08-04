<template>
  <b-card>
    <b-tabs pills>
      <b-tab @click="activeTab('events_tab')">
        <template #title>
          <feather-icon icon="GiftIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Eventos</span>
        </template>
        <c-events
          :projectId="projectSelectedFilter"
          class="mt-2 pt-75"
          v-if="selected_tab_name === 'events_tab'"
        />
      </b-tab>

      <b-tab @click="activeTab('course_tab')">
        <template #title>
          <feather-icon icon="ArchiveIcon" size="16" class="mr-0 mr-sm-50" />
          <span class="d-none d-sm-inline">Cursos</span>
        </template>
        <c-courses
          :projectId="projectSelectedFilter"
          class="mt-2 pt-75"
          v-if="selected_tab_name === 'course_tab'"
        />
      </b-tab>
    </b-tabs>
    <!-- Filter -->
    <!-- <b-button
      class="btn-filter-project btn-icon rounded-circle"
      variant="gradient-info"
      @click="isActiveFilter = true"
    >
      <feather-icon icon="FilterIcon" size="25" />
    </b-button>
    <b-sidebar
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="isActiveFilter"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="isActiveFilter">
        <div
          class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1"
        >
          <h5 class="mb-0">Filtros</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <b-form class="px-1 mt-1">
          <b-row>
            <b-col cols="12">
              <b-form-group label="Projeto">
                <vue-autosuggest
                  v-model="queryProject"
                  :suggestions="projects"
                  :input-props="inputProps"
                  :section-configs="projectConfigs"
                  @input="getProjects"
                >
                  <template slot-scope="{ suggestion }">
                    <b-badge class="text-capitalize" size="lg">
                      {{ getinitials(suggestion.item) }}
                    </b-badge>
                    {{ suggestion.item.name }}
                  </template>
                </vue-autosuggest>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-button @click="filter(false)" variant="gradient-info" block>
                FILTRAR
              </b-button>
            </b-col>
            <b-col cols="12" class="mt-2">
              <b-button @click="filter(true)" variant="primary" block>
                LIMPAR
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </template>
    </b-sidebar> -->
  </b-card>
</template>

<script>
import { BCard, BAlert, BLink } from "bootstrap-vue";
import Events from "./events/project-events";
import Courses from "./courses/project-courses";
import _projectsService from "@/services/projects-service";

export default {
  components: {
    BCard,
    BAlert,
    BLink,
    "c-courses": Courses,
    "c-events": Events,
  },
  data() {
    return {
      debounceMilliseconds: 300,
      isloading: false,
      selected_tab_name: "events_tab",
      isActiveFilter: false,
      queryProject: "",
      projects: [],
      inputProps: {
        id: "autoprojects__input_ajax",
        placeholder: "Digite o nome do projeto",
        class: "form-control",
        name: "ajax",
      },
      projectSelected: null,
      projectSelectedFilter: null,
      projectFilter: false,
      projectConfigs: {
        projects: {
          limit: 20,
          label: "Projetos",
          onSelected: (selected) => {
            this.projectSelected = selected.item;
          },
        },
      },
      record: {
        id: 0,
        name: "",
      },
    };
  },
  created() {
    this.getRecordProject();
  },
  methods: {
    activeTab(tab) {
      this.selected_tab_name = tab;
      this.getRecordProject();
    },
    getRecordProject() {
      if (this.$route.params.project && this.$route.params.project > 0) {
        this.isloading = true;
        _projectsService
          .find(this.$route.params.project)
          .then((res) => {
            if (res && res.content) {
              this.record = res.content;
              this.projectSelected = {
                id: this.record.id,
                name: this.record.name,
              };
              this.queryProject = this.projectSelected.name;
              this.filter(false);
            } else {
              this.projectSelected = {
                id: this.$route.params.project,
                name: "---",
              };
              this.filter(false);
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getProjects() {
      if (this.queryProject && this.queryProject.length >= 3) {
        this.timeout = setTimeout(() => {
          if (!this.isloading) {
            this.isloading = true;
            _projectsService
              .autoComplete(this.queryProject)
              .then((res) => {
                this.projects = [{ name: "projects", data: res.content }];
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isloading = false));
          }
        }, this.debounceMilliseconds);
      }
    },
    getinitials(_item) {
      const ii = _item.name.split(" ");
      if (ii.length >= 2) {
        return ii[0].substring(0, 1) + ii[1].substring(0, 1);
      } else {
        return ii[0].substring(0, 2);
      }
    },
    filter(limpar) {
      this.isActiveFilter = false;
      if (limpar) {
        this.projectSelected = null;
        this.queryProject = "";
        this.projects = [];
      }
      this.projectSelectedFilter = this.projectSelected;
      if (
        limpar &&
        this.$route.params.project &&
        this.$route.params.project > 0
      ) {
        this.$router.push({
          path: `/backoffice`,
        });
      }
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
.btn-filter-project {
  position: fixed;
  bottom: 5%;
  right: 45px;
  z-index: 99;
}
</style>