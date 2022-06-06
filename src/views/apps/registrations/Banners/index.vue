<template>
  <viewcard--c title="Lista de Banners" :btnew="btnew">
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
      <template #cell(image)="data">
        <img
          :src="data.item.imageurl"
          style="border-radius: 50%; width: 67px; height: 67px"
        />
      </template>
      <template #cell(type)="data">
        {{ data.item.ds_type }}
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
import _bannerService from "@/services/banner-service";
export default {
  data() {
    return {
      btnew: {
        permission: "banner.create",
        to: "/registrations/banner/0",
      },
      isloading: false,
      currentePage: 1,
      search: "",
      more: false,
      size: 20,
      fields: [
        { key: "image", label: "Imagem" },
        { key: "type", label: "Tipo" },
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
      _bannerService
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
        path: `/registrations/banner/${record.id}`,
      });
    },
  },
};
</script>