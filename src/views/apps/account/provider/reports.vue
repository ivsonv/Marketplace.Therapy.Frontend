<template>
  <viewcard--c title="Relatório Financeiro" :btnew="btnew">
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
      <b-col cols="6" md="2" class="mb-1">
        <b-form-input
          placeholder="Data Início"
          autocomplete="off"
          v-model="filter.start"
          size="lg"
        />
      </b-col>
      <b-col cols="6" md="2" class="mb-1">
        <b-form-input
          placeholder="Data Final"
          autocomplete="off"
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
      <template #cell(actions)="data">
        <div class="text-nowrap">
          <feather-icon
            icon="EditIcon"
            size="22"
            class="mx-1"
            @click="onClickSelected(data.item)"
          />
        </div>
      </template>
    </b-table>
    <h2 class="text-center mt-2 mt-md-5" v-else>
      Nenhum registro encontrada para os parametros acima informados.
    </h2>
    <div class="d-flex justify-content-center">
      <b-button @click="getLoadMore" variant="primary" v-if="more" pill>
        Carregar mais
      </b-button>
    </div>
  </viewcard--c>
</template>

<script>
import _accounService from "@/services/account-provider-service";
export default {
  data() {
    return {
      isloading: false,
      currentePage: 1,
      filter: {
        search: "",
        start: null,
        end: null,
      },
      more: false,
      size: 20,
      fields: [
        { key: "date", label: "Data/Hora Sessão" },
        { key: "client", label: "Cliente" },
        { key: "price", label: "Receita" },
        { key: "actions", label: "Ações" },
      ],
      list: [],
    };
  },
  created() {
    //this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _bankService
        .show(_page, this.search)
        .then((res) => {
          if (res.content) {
            this.more = res.content.length >= this.size;
            this.list.push(...res.content);
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
    onClickSelected(record, _) {},
  },
};
</script>