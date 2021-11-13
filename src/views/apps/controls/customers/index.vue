<template>
  <viewcard--c title="Listagem de Clientes" :btnew="btnew">
    <hr class="m-0 p-0 mb-1" />
    <b-row class="mb-1 d-flex justify-content-end">
      <b-col md="6">
        <b-form-group label="">
          <b-input-group>
            <b-form-input
              placeholder="pesquise por nome, email cpf/cnpj..."
              autocomplete="off"
              v-model="search"
            />
            <b-input-group-append>
              <b-button variant="gradient-info" @click="filter">
                Pesquisar
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <view--c permission="customer.view" :busy="isloading">
      <b-table
        :busy="isloading"
        :fields="fields"
        :items="list"
        responsive
        striped
        hover
      >
        <template #cell(active)="data">
          <div class="text-center">
            <b-avatar
              :variant="data.item.active ? 'success' : 'danger'"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.active ? 'CheckIcon' : 'XIcon'"
              />
            </b-avatar>
          </div>
        </template>
        <template #cell(cpf)="data">
          <div class="text-nowrap">
            <b-form-input
              v-model="data.item.cnpj"
              v-mask="$utils.masked.cnpj"
              class="d-none"
            />
            <b-form-input
              v-model="data.item.cpf"
              v-mask="$utils.masked.cpf"
              class="d-none"
            />
          </div>
          <div class="text-nowrap">
            {{
              data.item.cnpj
                ? data.item.cnpj
                : data.item.cpf
                ? data.item.cpf
                : "--"
            }}
          </div>
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
    </view--c>
  </viewcard--c>
</template>
<script>
import _customerService from "@/services/customers-service";
export default {
  data() {
    return {
      btnew: null,
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "cpf", label: "CPF/CNPJ" },
        { key: "actions", label: "Ações", thClass: "text-center" },
      ],
      list: [],
    };
  },
  destroyed() {
    this.$destroy();
  },
  mounted() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      const _search = `${this.search}`;

      this.isloading = true;
      _customerService
        .show(_page, _search)
        .then((res) => {
          if (res.content) {
            this.more = res.content.customer.length >= this.size;
            this.list.push(...res.content.customer);
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
        path: `/controls/customer/${record.id}`,
      });
    },
  },
};
</script>