<template>
  <section id="dashboard-ecommerce">
    <h1 v-if="loading">carregando...<spinner--c /></h1>
    <b-row v-else class="match-height">
      <b-col cols="12" lg="7">
        <b-card v-if="lst" no-body class="card-company-table">
          <b-table
            :items="lst"
            :fields="fields"
            responsive
            class="mb-0"
          ></b-table>
        </b-card>
      </b-col>
      <b-col cols="12" md="6" lg="5">
        <b-card no-body class="card-statistics">
          <b-card-header>
            <b-card-title>Visão Geral</b-card-title>
            <b-card-text class="mr-25 mb-0 text-uppercase"></b-card-text>
          </b-card-header>

          <b-card-body class="statistics-body">
            <b-row>
              <b-col
                v-for="(item, i) in lstcc"
                :key="i"
                cols="6"
                :class="item.customClass"
              >
                <b-media no-body>
                  <b-media-aside class="mr-2">
                    <b-avatar size="48" :variant="item.color">
                      <feather-icon size="24" :icon="item.icon" />
                    </b-avatar>
                  </b-media-aside>
                  <b-media-body class="my-auto">
                    <h4 class="font-weight-bolder mb-0">
                      {{ item.title }}
                    </h4>
                    <b-card-text class="font-small-3 mb-0">
                      {{ item.subtitle }}
                    </b-card-text>
                  </b-media-body>
                </b-media>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import _dashboardService from "@/services/dashboard-service";
import {
  BCard,
  BCardHeader,
  BCardTitle,
  BCardText,
  BCardBody,
  BRow,
  BCol,
  BMedia,
  BMediaAside,
  BAvatar,
  BMediaBody,
} from "bootstrap-vue";

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BMedia,
    BAvatar,
    BMediaAside,
    BMediaBody,
  },
  data() {
    return {
      loading: false,
      lstcc: [
        {
          icon: "UserIcon",
          customClass: "mb-2 mb-xl-0",
          color: "light-primary",
          title: "150",
          subtitle: "Clientes",
        },
        {
          icon: "UserIcon",
          customClass: "mb-2 mb-xl-0",
          color: "light-info",
          title: "150",
          subtitle: "Psicólogos",
        },
      ],
      lst: [],
      fields: [
        { key: "mes", label: "Mês" },
        { key: "price_sales", label: "Vendas" },
        { key: "price_sales_revenue", label: "Comissão" },
        { key: "total_appointment", label: "Atendimentos" },
        { key: "total_appointment_canceled", label: "Atend. Cancelados" },
      ],
    };
  },
  created() {
    this.getoverview();
  },
  methods: {
    getoverview() {
      this.loading = true;
      _dashboardService
        .overview()
        .then((_res) => {
          this.lst = _res.content;
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/dashboard-ecommerce.scss";
@import "@core/scss/vue/libs/chart-apex.scss";
@import "~@core/scss/base/bootstrap-extended/include";
@import "~@core/scss/base/components/variables-dark";

.card-company-table ::v-deep td .b-avatar.badge-light-company {
  .dark-layout & {
    background: $theme-dark-body-bg !important;
  }
}
</style>