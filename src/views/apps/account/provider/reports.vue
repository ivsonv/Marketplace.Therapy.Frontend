<template>
  <viewcard--c title="Relatório Financeiro" :busy="isloading">
    <hr class="m-0 p-0 mb-1" />
    <b-row class="mb-1 d-flex justify-content-start">
      <b-col md="4" class="mb-1">
        <b-form-input
          placeholder="pesquise por cliente/evento..."
          autocomplete="off"
          v-model="filter.search"
          size="lg"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-1">
        <b-form-datepicker
          :date-format-options="{ day: '2-digit' }"
          v-model="filter.start"
          placeholder="Data Início"
          size="lg"
        />
      </b-col>
      <b-col cols="12" md="2" class="mb-1">
        <b-form-datepicker
          :date-format-options="{ day: '2-digit' }"
          placeholder="Data Final"
          v-model="filter.end"
          size="lg"
        />
      </b-col>
      <b-col cols="12" md="4">
        <b-button size="lg" variant="info" @click="searching" class="mr-1">
          PESQUISAR
        </b-button>
        <b-button size="lg" variant="info" @click="searching">
          EXPORTAR RELATÓRIO
        </b-button>
      </b-col>
    </b-row>
    <b-table
      v-if="list && list.length > 0"
      :busy="isloading"
      :fields="fields"
      :items="list"
      responsive
      striped
      hover
    >
      <template #cell(start)="data">
        {{ data.item.start }} ás {{ data.item.hour }}h
      </template>
      <template #cell(revenue)="data">
        R$ {{ data.item.revenue.toFixed(2) }}
      </template>
      <template #cell(actions)="data">
        <div class="text-nowrap">
          <feather-icon
            icon="FileTextIcon"
            size="22"
            class="mx-1"
            @click="onClickSelected(data.item)"
          />
        </div>
      </template>
    </b-table>
    <h2 class="text-center mt-2 mt-md-5" v-else>
      Nenhum registro encontrado para os parametros acima informados.
    </h2>
    <div class="d-flex justify-content-center">
      <b-button @click="getLoadMore" variant="primary" v-if="more" pill>
        Carregar mais
      </b-button>
    </div>
  </viewcard--c>
</template>

<script>
import _providerService from "@/services/account-provider-service";
import { BFormDatepicker } from "bootstrap-vue";

export default {
  components: {
    BFormDatepicker,
  },
  data() {
    return {
      isloading: false,
      currentePage: 1,
      filter: {
        start: null,
        end: null,
      },
      more: false,
      size: 20,
      fields: [
        { key: "customer", label: "Cliente" },
        { key: "start", label: "Data/Hora Sessão" },
        { key: "revenue", label: "Receita" },
        { key: "actions", label: "Invoice" },
      ],
      list: [],
    };
  },
  destroyed() {
    this.$destroy();
  },
  methods: {
    getRecords(_page) {
      const payload = {
        page: _page,
        search: this.filter.search,
        data: {
          start: this.filter.start,
          end: this.filter.end,
        },
      };

      this.isloading = true;
      _providerService
        .reports(payload)
        .then((res) => {
          if (res.content) {
            this.more = res.content.reports.length >= this.size;
            this.list.push(...res.content.reports);
            this.currentePage = _page;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore() {
      this.getRecords(this.currentePage + 1);
    },
    searching() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSelected(_item) {
      this.$router.push({
        name: "sou-provider-agendamento-invoice",
        params: { id: _item.id },
      });
    },
  },
};
</script>