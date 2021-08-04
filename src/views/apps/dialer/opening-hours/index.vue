<template>
  <viewcard--c title="Horário de Funcionamento" :btnew="btnew">
    <view--c :permission="'permission.dialer.hour.fun.view'" :busy="isloading">
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
import _openinghoursService from "@/services/dialer/opening-hours-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.dialer.hour.fun.create",
        to: "/dialer/opening-hours/0",
      },
      isloading: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Nome" },
        { key: "start", label: "Início" },
        { key: "end", label: "Fim" },
        { key: "sunday", label: "D" },
        { key: "monday", label: "S" },
        { key: "tuesday", label: "T" },
        { key: "wednesday", label: "Q" },
        { key: "thursday", label: "Q" },
        { key: "friday", label: "S" },
        { key: "saturday", label: "S" },
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
      _openinghoursService
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
        path: `/dialer/opening-hours/${record.id}`,
      });
    },
  },
};
</script>