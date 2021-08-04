<template>
  <div>
    <!-- Filter -->
    <b-button
      class="btn-filter-appoitment btn-icon rounded-circle"
      :variant="containsFilter ? 'gradient-warning' : 'gradient-info'"
      @click="isActiveFilter = true"
    >
      <feather-icon icon="FilterIcon" size="25" />
    </b-button>
    <b-embed
      type="iframe"
      aspect="16by9"
      v-if="this.iframeUrl"
      :src="getDashboard(appConfig.layout.skin)"
      allowfullscreen
    />

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
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
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
        <b-form class="m-1">
          <b-row>
            <b-col cols="12">
              <b-form-group label="Fila *">
                <v-select
                  v-if="queues.length > 0"
                  v-model="queuesSelected"
                  :options="queues"
                  autocomplete="off"
                  :clearable="false"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-button @click="filter()" variant="gradient-info" block>
                FILTRAR
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </template>
    </b-sidebar>
  </div>
</template>
<script>
import { BEmbed } from "bootstrap-vue";
import { mapState } from "vuex";
import _queuesService from "@/services/pabx/queues-service";

export default {
  components: {
    BEmbed,
  },
  computed: {
    ...mapState(["appConfig"]),
  },
  data() {
    return {
      GRAFANA_URL:
        "https://panel.services.atentoti.tech/d/KC-OqeR7k2/telefonia-filas?orgId=3&refresh=5s&from=now-5m&to=now",
      filavar: "var-Fila=",
      filaname: "101",
      iframeUrl: "",
      theme: "",
      containsFilter: false,
      isActiveFilter: false,
      queues: [],
      queuesSelected: null,
    };
  },
  created() {
    this.getQueues();
    this.getDashboard();
  },
  methods: {
    getDashboard(skin) {
      this.theme = skin;
      let themef = skin === "dark" ? "&theme=dark" : "&theme=light";
      this.iframeUrl = `${this.GRAFANA_URL}&${this.filavar}${this.filaname}&kiosk${themef}`;
      return this.iframeUrl;
    },
    filter() {
      if (this.queuesSelected) {
        this.filaname = this.queuesSelected.value;
      }
      this.getDashboard(this.theme);
      this.isActiveFilter = false;
    },
    getQueues() {
      this.isloading = true;
      _queuesService
        .show(1, "")
        .then((res) => {
          this.queues = res.content.map((m) => {
            return {
              label: `${m.name} - ${m.queueName}`,
              value: m.name,
            };
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>
<style lang="scss">
.btn-filter-appoitment {
  position: fixed;
  bottom: 5%;
  right: 45px;
  z-index: 99;
}
</style>