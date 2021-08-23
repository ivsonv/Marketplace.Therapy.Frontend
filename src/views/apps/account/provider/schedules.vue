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
              <b-form-input
                v-model="hourNew.start"
                type="time"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="FINAL">
              <b-form-input
                v-model="hourNew.end"
                type="time"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <div class="d-block">
          <b-button @click="save" variant="info" class="mr-1" size="lg">
            Salvar
          </b-button>
        </div>
      </b-modal>
    </b-row>

    <b-table
      :busy="loading"
      :fields="fields"
      :items="list"
      responsive
      striped
      hover
    >
      <template #cell(day_week)="data">
        <div class="text-nowrap">
          {{ data.item.ds_week }}
        </div>
      </template>
      <template #cell(start)="data">
        <div class="text-nowrap">
          {{ `${data.item.start.substring(0, 5)}h até ` }}
          {{ `${data.item.end.substring(0, 5)}h` }}
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
          <feather-icon
            icon="Trash2Icon"
            size="22"
            class="mx-1"
            @click="onClickRemove(data.item)"
          />
        </div>
      </template>
    </b-table>
  </viewcard--c>
</template>

<script>
import _accounService from "@/services/account-provider-service";
export default {
  data() {
    return {
      loading: false,
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
        { key: "day_week", label: "Semana" },
        { key: "start", label: "Horário" },
        { key: "actions", label: "Ações" },
      ],
      list: [],
    };
  },
  created() {
    this.getRecords();
  },
  methods: {
    save() {
      if (!this.optionsWeekSelected) {
        this.$utils.toastError("Ops!!!", "Selecione a Semana.");
        return;
      }

      this.hourNew.day_week = this.optionsWeekSelected.key;

      const payload = { data: { schedule: { ...this.hourNew } } };

      this.$refs["modal-hour"].hide();
      this.loading = true;
      _accounService
        .saveSchedules(payload)
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.getRecords();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    newHour() {
      this.optionsWeekSelected = null;
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
    getRecords() {
      this.isloading = true;
      _accounService
        .fetchSchedules()
        .then((res) => {
          if (res.content) {
            this.list = res.content.schedules;
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onClickSelected(_item) {
      this.optionsWeekSelected = this.optionsWeek.filter(
        (f) => f.key.toString() === _item.day_week.toString()
      )[0];

      this.hourNew = _item;
      this.$refs["modal-hour"].show();
    },
    onClickRemove(_item) {
      this.$swal({
        title: "Tem certeza?",
        text: "Isso não pode ser revertido!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero excluir!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.remove(_item);
        }
      });
    },
    remove(_item) {
      this.loading = true;
      _accounService
        .removeSchedules(_item.id)
        .then(() => {
          this.$utils.toast("Notificação", "Removido com sucesso.");
          this.getRecords();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>