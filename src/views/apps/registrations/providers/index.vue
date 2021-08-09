<template>
  <viewcard--c title="Listagem de Psicólogos" :btnew="btnew">
    <b-row class="mb-1 d-flex justify-content-start">
      <b-col md="3">
        <b-form-group label="Situação de Cadastro">
          <v-select
            v-model="situationSelected"
            :options="situations"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="5">
        <b-form-group label="-">
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
    <view--c permission="provider.view" :busy="isloading">
      <b-table
        :busy="isloading"
        :fields="fields"
        :items="list"
        responsive
        striped
        hover
      >
        <template #cell(fantasy_name)="data">
          {{ `${data.item.fantasy_name} ${data.item.company_name}` }}
        </template>
        <template #cell(cnpj)="data">
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
import _providerService from "@/services/providers-service";
export default {
  data() {
    return {
      btnew: {
        permission: "provider.create",
        to: "/registrations/provider/0",
      },
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "fantasy_name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "cnpj", label: "CPF/CNPJ" },
        { key: "ds_situation", label: "Situação" },
        { key: "actions", label: "Ações" },
      ],
      list: [],
      situations: [],
      situationSelected: null,
    };
  },
  created() {
    _providerService
      .showSituations()
      .then((res) => {
        this.situations = res;
      })
      .catch((error) => this.$utils.toastError("Notificação", error));
  },
  mounted() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      const _search = `${this.search}|${
        this.situationSelected ? this.situationSelected.value : "-1"
      }`;

      this.isloading = true;
      _providerService
        .show(_page, _search)
        .then((res) => {
          if (res.content) {
            this.more = res.content.provider.length >= this.size;
            this.list.push(...res.content.provider);
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
        path: `/registrations/provider/${record.id}`,
      });
    },
  },
};
</script>