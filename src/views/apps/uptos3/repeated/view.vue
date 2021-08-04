<template>
  <b-card>
    <b-tabs pills>
      <!-- Tab: Account -->

      <b-tab
        v-for="tabs in tabs_empresas"
        :key="tabs.id"
        @click="activeTab(tabs.name)"
        :active="selected_tab_name == tabs.name"
      >
        <template #title>
          <span class="d-none d-sm-inline">{{ tabs.name }}</span>
        </template>
        <uptos-3-questions
          v-if="selected_tab_name === tabs.name"
          class="mt-2 pt-75"
          :company="tabs.id.toString()"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { BTab, BTabs, BCard, BAlert, BLink } from "bootstrap-vue";
import Uptos3Questions from "./questions/uptos3-questions.vue";
import _service from "@/services/uptos3-service";

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    Uptos3Questions,
  },
  data() {
    return {
      selected_tab_name: "concurso_tab",
      concursos: "10",
      medicina: "5",
      vestibular: "11",
      militar: "12",
      tabs_empresas: [],
    };
  },
  created() {
    this.getTabs();
  },
  methods: {
    activeTab(tab) {
      this.selected_tab_name = tab;
    },
    tabs() {
      if (this.$route.params.company) {
        if (this.$route.params.company == "5")
          this.selected_tab_name = "medicina_tab";
        else if (this.$route.params.company == "11")
          this.selected_tab_name = "vestibular_tab";
        else if (this.$route.params.company == "12")
          this.selected_tab_name = "militar_tab";
        else this.selected_tab_name = "concurso_tab";
      } else this.selected_tab_name = "concurso_tab";
    },
    getTabs() {
      this.isloading = true;
      _service
        .getTabCompany()
        .then((res) => {
          if (res.content && res.content.length > 0) {
            res.content.forEach((element) => {
              this.tabs_empresas.push({ id: element.id, name: element.name });
              if (this.$route.params.company) {
                if (this.$route.params.company == element.id) {
                  this.selected_tab_name = element.name;
                }
              }
            });
            if (!this.$route.params.company) {
              this.selected_tab_name = this.tabs_empresas[0].name;
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>

<style>
</style>
