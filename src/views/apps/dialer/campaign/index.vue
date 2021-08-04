<template>
  <viewcard--c title="Campanha" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="5">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome, nome do parâmetro da campanha, nome da lista de contato..."
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
    <view--c permission="permission.dialer.campaign.view" :busy="isloading">
      <b-table
        :items="list"
        @row-clicked="onClickSelected"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
      >
        <template #cell(status_description)="data">
          <div class="text-nowrap">
            <feather-icon
              :id="`status-row-${data.item.id}`"
              icon="PhoneIcon"
              size="16"
              class="mx-1"
              v-if="data.item.status_description == 'ATIVA'"
            />
            <feather-icon
              :id="`status-row-${data.item.id}`"
              icon="PhoneMissedIcon"
              size="16"
              class="mx-1"
              v-if="data.item.status_description == 'PAUSADA'"
            />
            <feather-icon
              :id="`status-row-${data.item.id}`"
              icon="PhoneOffIcon"
              size="16"
              class="mx-1"
              v-if="data.item.status_description == 'FINALIZADA'"
            />
            <b-tooltip
              :title="data.item.status_description"
              :target="`status-row-${data.item.id}`"
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
import _campaignService from "@/services/dialer/campaign-service";
export default {
  data() {
    return {
      btnew: {
        permission: "permission.dialer.campaign.create",
        to: "/dialer/campaign/0",
      },
      isloading: false,
      currentePage: 1,
      more: false,
      search: "",
      size: 12,
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Nome" },
        { key: "campaignParameters.name", label: "Parâmetro de Campanha" },
        { key: "contactList.name", label: "Lista de Contato" },
        { key: "status_description", label: "Status" },
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
      _campaignService
        .show(_page, this.search)
        .then((res) => {
          if (res.content) {
            console.log(res.content);
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
        path: `/dialer/campaign/${record.id}`,
      });
    },
  },
};
</script>