<template>
  <viewcard--c title="HORÁRIOS DO SEU ATENDIMENTO" :busy="loading">
    <b-row>
      <b-col class="d-flex justify-content-end">
        <b-button variant="info" @click="newHour" class="mb-2" size="lg" pill>
          Criar Novo horário
        </b-button>
      </b-col>

      <!-- CADASTRAR NOVO HORARIO -->
      <b-modal
        ref="modal-hour"
        hide-footer
        title="Novo Horário"
        centered
        @hide="onHideTransfer"
      >
        <validation-observer ref="newHourRules">
          <b-row v-if="hourNew">
            <b-col cols="6">
              <b-form-group label="SEMANA">
                <v-select
                  v-model="optionsWeekSelected"
                  :options="optionsWeek"
                  autocomplete="off"
                />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="INICIO">
                <validation-provider
                  #default="{ errors }"
                  name="Nome"
                  rules="required"
                >
                  <b-form-input type="time" autocomplete="off" />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group label="FINAL">
                <validation-provider
                  #default="{ errors }"
                  name="Nome"
                  rules="required"
                >
                  <b-form-input type="time" autocomplete="off" />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <div class="d-block">
            <b-button @click="save" variant="info" class="mr-1" size="lg">
              Salvar
            </b-button>
          </div>
        </validation-observer>
      </b-modal>
    </b-row>

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
  </viewcard--c>
</template>

<script>
import _accountProviderService from "@/services/account-provider-service";
import _bankService from "@/services/bank-service";
export default {
  data() {
    return {
      loading: false,
      currentePage: 1,
      search: null,
      more: false,
      size: 20,
      hourNew: null,
      optionsWeekSelected: null,
      optionsWeek: [
        { label: "Segunda Feira", key: "1" },
        { label: "Terça Feira", key: "2" },
        { label: "Quarta Feira", key: "3" },
        { label: "Quinta Feira", key: "4" },
        { label: "Sexta Feira", key: "5" },
        { label: "Sábado", key: "6" },
        { label: "Domingo", key: "0" },
      ],
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
    save() {
      if (!this.optionsWeekSelected) {
        this.$utils.toastError("Ops!!!", "Selecione a Semana.");
        return;
      }

      this.hourNew.day_week = this.optionsWeekSelected.value;

      const payload = { data: { ...this.hourNew } };

      this.loading = true;
      _accountProviderService
        .save(payload)
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    newHour() {
      this.hourNew = {
        start: null,
        end: null,
        id: 0,
      };
      this.$refs["modal-hour"].show();
    },
    newHourFormModal() {},
    newHourCloseModal() {},
    onHideTransfer(evt) {
      if (evt.trigger === "backdrop") {
        evt.preventDefault();
      }
    },
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
    onClickSelected(record, _) {
      // this.$router.push({
      //   path: `/registrations/bank/${record.id}`,
      // });
    },
  },
};
</script>