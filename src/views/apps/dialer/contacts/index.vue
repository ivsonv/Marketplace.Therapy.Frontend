<template>
  <b-card title="Tipo de lista">
    <b-row class="mb-1 mb-sm-0">
      <b-col md="8">
        <b-button
          to="/dialer/contacts/configuration/0"
          variant="gradient-info"
          class="mb-2"
        >
          Cadastrar Tipo
        </b-button>
      </b-col>
      <b-col md="4">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome..."
            autocomplete="off"
            v-model="search"
          />
          <b-input-group-append>
            <b-button variant="gradient-info" @click="filter">
              Pesquisar
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>

    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-table
        @row-clicked="onClickSelected"
        :busy="isloading"
        :fields="fields"
        :items="list"
        responsive
        hover
      />
      <hr />
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="secondary" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </b-overlay>
  </b-card>
</template>

<script>
import _contactservice from "@/services/dialer/contact-type-list-service";
export default {
  data() {
    return {
      isloading: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [{ key: "name", label: "Tipo da Lista" }],
      list: [],
    };
  },
  created() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _contactservice
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
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSelected(record, _) {
      this.$router.push({
        path: `/dialer/contacts/configuration/${record.id}`,
      });
    },
  },
};
</script>