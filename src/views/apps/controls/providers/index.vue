<template>
  <viewcard--c title="Listagem de Psicólogos" :btnew="btnew">
    <hr class="m-0 p-0 mb-1" />
    <b-row class="mb-1 d-flex justify-content-start">
      <b-col md="3">
        <b-form-group label="Status de Cadastro">
          <v-select
            v-model="situationsCompletedSelected"
            :options="situationsCompleted"
            autocomplete="off"
            :clearable="false"
          />
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group label="Situação Meio de Pagamento">
          <v-select
            v-model="situationsSplitSelected"
            :options="situationsSplit"
            autocomplete="off"
            :clearable="false"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
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
        <template #cell(completed)="data">
          <div class="text-center">
            <b-avatar
              :variant="data.item.completed ? 'success' : 'danger'"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.completed ? 'CheckIcon' : 'XIcon'"
              />
            </b-avatar>
          </div>
        </template>
        <template #cell(split)="data">
          <div class="text-center">
            <b-avatar
              :variant="data.item.split ? 'success' : 'danger'"
              size="25"
            >
              <feather-icon
                size="16"
                :icon="data.item.split ? 'CheckIcon' : 'XIcon'"
              />
            </b-avatar>
          </div>
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
      btnew: null,
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "fantasy_name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "cnpj", label: "CPF/CNPJ" },
        { key: "completed", label: "Status Cadastro", thClass: "text-center" },
        {
          key: "split",
          label: "Status Meio Pagamento",
          thClass: "text-center",
        },
        { key: "actions", label: "Ações", thClass: "text-center" },
      ],
      list: [],
      situationsSplit: [],
      situationsSplitSelected: null,
      situationsCompleted: [],
      situationsCompletedSelected: null,
    };
  },
  created() {
    this.situationsSplit = [
      { label: "Todos", value: "-1" },
      { label: "Integrado (NEXXERA)", value: "1" },
      { label: "Não Integrado (NEXXERA)", value: "2" },
    ];
    this.situationsSplitSelected = { label: "Todos", value: "-1" };

    this.situationsCompleted = [
      { label: "Todos", value: "-1" },
      { label: "Completos", value: "1" },
      { label: "Incompletos", value: "2" },
    ];
    this.situationsCompletedSelected = { label: "Todos", value: "-1" };
  },
  mounted() {
    this.getRecords(this.currentePage);
  },
  methods: {
    getRecords(_page) {
      const _search = `${this.search}
      |${
        this.situationsSplitSelected ? this.situationsSplitSelected.value : "-1"
      }
      |${
        this.situationsCompletedSelected
          ? this.situationsCompletedSelected.value
          : "-1"
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