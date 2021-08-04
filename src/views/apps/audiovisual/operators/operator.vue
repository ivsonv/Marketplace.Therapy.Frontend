<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Operador' : 'Cadastrar Operador'"
    :btsave="null"
    :btdelete="null"
    :btback="{}"
    :busy="loading"
  >
    <b-form @submit.prevent>
      <b-row>
        <b-col md="6">
          <b-form-group label="Nome">
            <b-form-input
              v-model="record.name"
              placeholder="Nome do Operador"
            />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="E-mail">
            <div class="form-label-group">
              <b-form-input
                type="email"
                v-model="record.email"
                placeholder="Informe um e-mail"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Cargo">
            <v-select
              v-if="carrers.length > 0 && carrerSelected"
              v-model="carrerSelected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="carrers"
              autocomplete="off"
              :clearable="false"
            />
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Turno">
            <v-select
              v-if="shifts.length > 0 && shiftsSelected"
              v-model="shiftsSelected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="shifts"
              autocomplete="off"
              :clearable="false"
            />
          </b-form-group>
        </b-col>

        <b-col md="3">
          <b-form-group label="Telefone">
            <div class="form-label-group">
              <b-form-input
                v-model="record.phone"
                placeholder="Telefone"
                v-mask="$utils.masked.phone"
                autocomplete="off"
              />
            </div>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </viewcard--c>
</template>
<script>
import _operatorsService from "@/services/operators-service";
import _carrersService from "@/services/carrers-service";
import scalesService from "@/services/scales-service";
export default {
  data() {
    return {
      loading: false,
      carrers: [],
      carrerSelected: { label: "Cargo....", value: "-3" },
      shifts: [],
      shiftsSelected: { label: "turno....", value: "-3" },
      record: {
        id: 0,
        name: "",
        email: "",
        phone: "",
      },
    };
  },
  created() {
    this.getcarrers();
    this.getshifts();
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getcarrers() {
      this.loading = true;
      _carrersService
        .show()
        .then((res) => {
          this.carrers = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getshifts() {
      this.loading = true;
      scalesService
        .show()
        .then((res) => {
          this.shifts = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _operatorsService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.career) {
              this.carrerSelected = {
                label: this.record.career.name,
                value: this.record.career.id,
              };
              this.record.career = null;
            }
            if (this.record.scale) {
              this.shiftsSelected = {
                label: this.record.scale.name,
                value: this.record.scale.id,
              };
              this.record.scale = null;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      this.record.career_id = this.$utils.getValueSelected(this.carrerSelected);
      this.record.shifts_id = this.$utils.getValueSelected(this.shiftsSelected);

      const payload = { data: { ...this.record } };

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _operatorsService.create(payload)
          : _operatorsService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    confirmDelete() {
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
          this.excluir();
        }
      });
    },
    excluir() {
      this.loading = true;
      _operatorsService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>