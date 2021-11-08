<template>
  <viewcard--c title="Agendamentos" :busy="isloading">
    <hr class="m-0 p-0 mb-1" />
    <b-row class="mb-1 d-flex justify-content-start">
      <b-col cols="12" lg="4">
        <b-form-group label="Data Início">
          <b-form-datepicker
            :date-format-options="{ day: '2-digit' }"
            v-model="filter.start"
            placeholder="Data Início"
          />
        </b-form-group>
      </b-col>
      <b-col cols="12" lg="4">
        <b-form-group label="Data Fim">
          <b-form-datepicker
            :date-format-options="{ day: '2-digit' }"
            v-model="filter.end"
            placeholder="Data Fim"
          />
        </b-form-group>
      </b-col>
      <b-col cols="12" lg="4">
        <b-form-group label="Código Transação">
          <b-form-input placeholder="Código Getaway" autocomplete="off" />
        </b-form-group>
      </b-col>

      <b-col cols="12" lg="4">
        <b-form-group label="Situação Pedido">
          <v-select
            v-model="situationsSplitSelected"
            :options="situationsSplit"
            autocomplete="off"
            :clearable="false"
          />
        </b-form-group>
      </b-col>
      <b-col cols="12" lg="4">
        <b-form-group label="Situação Pagamento">
          <v-select
            v-model="situationsSplitSelected"
            :options="situationsSplit"
            autocomplete="off"
            :clearable="false"
          />
        </b-form-group>
      </b-col>
      <b-col cols="12" lg="4">
        <b-form-group label="Código Pedido">
          <b-form-input
            type="number"
            placeholder="Código pedido"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mx-25 mb-1 d-flex justify-content-end">
      <div>
        <b-button variant="gradient-info"> PESQUISAR </b-button>
      </div>
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
          <div class="text-nowrap">
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
          <div class="text-nowrap">
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
import { BFormDatepicker } from "bootstrap-vue";
export default {
  components: {
    BFormDatepicker,
  },
  data() {
    return {
      isloading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      fields: [
        { key: "id", label: "Cód." },
        { key: "email", label: "E-mail" },
        { key: "cnpj", label: "CPF/CNPJ" },
        { key: "completed", label: "Completo" },
        { key: "split", label: "Split" },
        { key: "actions", label: "Ações" },
      ],
      list: [],
      filter: {
        start: "",
        end: "",
        transaction_code: null,
        payment_status: null,
        status: null,
      },
      statusList: [],
      statusSelected: null,
      payStatusList: [],
      payStatusSelected: null,
    };
  },
  created() {
    //this.init();
  },
  mounted() {
    this.getRecords(this.currentePage);
  },
  methods: {
    init() {
      this.situationsSplit = [
        { label: "Todos", value: "-1" },
        { label: "Com Split", value: "1" },
        { label: "Sem Split", value: "2" },
      ];
      this.situationsSplitSelected = { label: "Todos", value: "-1" };

      this.situationsCompleted = [
        { label: "Todos", value: "-1" },
        { label: "Completos", value: "1" },
        { label: "Incompletos", value: "2" },
      ];
      this.situationsCompletedSelected = { label: "Todos", value: "-1" };
    },

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