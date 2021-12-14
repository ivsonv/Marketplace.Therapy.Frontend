<template>
  <viewcard--c title="FAQ" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-end">
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
    </b-row>
    <view--c permission="faq.view" :busy="isloading">
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
    </view--c>
  </viewcard--c>
</template>

<script>
import _faqService from "@/services/faq-service";
export default {
  data() {
    return {
      btnew: {
        permission: "faq.create",
        to: "/registrations/faq/0",
      },
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "title", label: "Titulo" },
        { key: "sub_title", label: "SUB -Titulo" },
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
      _faqService
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
        path: `/registrations/faq/${record.id}`,
      });
    },
  },
};
</script>