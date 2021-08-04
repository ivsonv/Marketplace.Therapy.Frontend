<template>
  <viewcard--c title="Destinos" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="5">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome, nome da fila..."
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
    <view--c :permission="'permission.dialer.destiny.view'" :busy="isloading">
      <b-table
        :items="list"
        @row-clicked="onClickSelected"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
      >
        <template #cell(amd)="data">
          <div class="text-nowrap">
            {{ data.item.amd ? "SIM" : "NÃO" }}
          </div>
        </template>
        <template #cell(pattern_audio)="data">
          <div class="text-nowrap">
            {{ data.item.pattern_audio ? "SIM" : "NÃO" }}
          </div>
        </template>
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
import _destinyService from "@/services/dialer/destiny-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.dialer.destiny.create",
        to: "/dialer/destinations/0",
      },
      isloading: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Nome" },
        { key: "queues", label: "Fila ID" },
        { key: "queues_name", label: "Fila Nome" },
        { key: "amd", label: "amd" },
        { key: "pattern_audio", label: "Áudio Padrão" },
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
      _destinyService
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
        path: `/dialer/destinations/${record.id}`,
      });
    },
  },
};
</script>