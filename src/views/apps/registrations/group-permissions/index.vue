<template>
  <viewcard--c title="Grupo de acesso" :btnew="btnew">
    <!-- <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="5">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por nome..."
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
    </b-row> -->
    <view--c permission="group.permission.view" :busy="isloading">
      <b-table
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
              :id="`details-studiogroup-row-${data.item.id}`"
              icon="TrelloIcon"
              size="22"
              class="mx-1"
              @click="onClickSelected(data.item)"
            />
            <b-tooltip
              v-if="data.index > 0"
              title="Detalhes"
              :target="`details-studiogroup-row-${data.item.id}`"
            />
          </div>
        </template>
      </b-table>
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="warning" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </view--c>
  </viewcard--c>
</template>

<script>
import _groupService from "@/services/group-permissions";
export default {
  data() {
    return {
      btnew: {
        permission: "group.permission.create",
        to: "/registrations/group-permission/0",
      },
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 12,
      rows: 20,
      fields: [
        { key: "name", label: "Nome" },
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
      _groupService
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
        path: `/registrations/group-permission/${record.id}`,
      });
    },
    onClickUsers(record) {
      this.$router.push({
        path: `/registrations/group-permission/${record.id}/users`,
      });
    },
  },
};
</script>