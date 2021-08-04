<template>
  <viewcard--c title="Filas" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="5">
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

    <view--c :permission="'permission.pabx.queue.view'" :busy="isloading">
      <b-table
        :items="list"
        @row-clicked="onClickSelected"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
      >
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`delete-row-${data.item.id}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
            />
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
import _pabxService from "@/services/pabx-service";
import pabx_queue from "./queue.vue";
import _queuesService from "@/services/pabx/queues-service";

export default {
  components: {
    "pabx-queue-form": pabx_queue,
  },
  data() {
    return {
      btnew: {
        permission: "permission.pabx.queue.create",
        to: "/pabx/queue/0",
      },
      isloading: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "name", label: "código" },
        { key: "queueName", label: "Nome" },
        { key: "actions", label: "Ações" },
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
      _queuesService
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
    getLoadMore(_page) {
      this.getRecords(this.currentePage + 1);
    },
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSelected(record, _) {
      this.$router.push({
        path: `/pabx/queue/${record.name}`,
      });
    },
  },
};
</script>