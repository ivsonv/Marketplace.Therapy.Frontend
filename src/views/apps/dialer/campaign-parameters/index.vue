<template>
  <viewcard--c title="Parâmetros de Campanha" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="5">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Destino..."
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
    <view--c
      :permission="'permission.dialer.param.campaign.view'"
      :busy="isloading"
    >
      <b-table
        :items="list"
        @row-clicked="onClickSelected"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
      >
      </b-table>
      <hr />
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="secondary" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </view--c>
  </viewcard--c>
</template>

<script>
import _campaignParametersService from "@/services/dialer/campaign-parameters-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.dialer.param.campaign.create",
        to: "/dialer/campaign-parameters/0",
      },
      isloading: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Nome" },
        { key: "destiny.name", label: "Destino" },
      ],
      list: [],
    };
  },
  created() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      this.isloading = true;
      _campaignParametersService
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
        path: `/dialer/campaign-parameters/${record.id}`,
      });
    },
  },
};
</script>