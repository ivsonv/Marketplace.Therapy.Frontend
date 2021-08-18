<template>
  <viewcard--c title="MEUS HORÁRIOS" :busy="isloading">
    <b-table
      :busy="isloading"
      :fields="fields"
      :items="list"
      responsive
      striped
      hover
    >
      <template #cell(name)="data">
        <div class="text-nowrap">
          {{ `${data.item.code} - ${data.item.name}` }}
        </div>
      </template>
      <template #cell(active)="data">
        <feather-icon
          :icon="data.item.active ? 'CheckIcon' : 'XIcon'"
          size="22"
          class="mx-1"
        />
      </template>
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
    <div class="d-flex justify-content-center">
      <b-button @click="getLoadMore" variant="primary" v-if="more" pill>
        Carregar mais
      </b-button>
    </div>
  </viewcard--c>
</template>

<script>
import _bankService from "@/services/bank-service";
export default {
  data() {
    return {
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "active", label: "Status" },
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
    filter() {
      this.currentePage = 1;
      this.list = [];
      this.getRecords(this.currentePage);
    },
    onClickSelected(record, _) {
      this.$router.push({
        path: `/registrations/bank/${record.id}`,
      });
    },
  },
};
</script>